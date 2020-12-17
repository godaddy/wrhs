const { promises: fs } = require('fs');
const fetch = require('node-fetch');
const { URL } = require('url');

const { getFileStats } = require('./file');

/**
 * @typedef {import('node-fetch').Response} NodeFetchResponse
 */

/* Utility class to manage API requests */
class Request {
  /**
   * Create an instance of Request
   * @param {string} baseUrl Warehouse API base url
   * @param {string} opts.username Username
   * @param {string} opts.password Password
   */
  constructor({ baseUrl, username, password }) {
    this._baseUrl = baseUrl;
    this._auth = this._basicAuth({ username, password });
  }

  /**
   * Generate basic authorization header
   * @private
   * @param {Object} opts Method paramaters
   * @param {string} opts.username Username
   * @param {string} opts.password Password
   * @returns {string} Basic auth header
   */
  _basicAuth({ username, password }) {
    const b64 = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${b64}`;
  }

  /**
   * Validate http response
   * @param {NodeFetchResponse} res HTTP response
   * @returns {Promise<void>} Promise representing the verification result
   */
  async _checkRespStatus(res) {
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`${res.status} ${res.statusText} ${errorBody}`);
    }
  }

  /**
   * Send an http request cotaining a JSON-like body data
   * @private
   * @param {Object} opts Method paramaters
   * @param {string} opts.endpoint API endpoint
   * @param {string} opts.body JSON-like body data
   * @param {string} opts.method Http request method
   * @returns {Promise<Object>} Promise representing the API response
   */
  async _reqWithJSONBody({ endpoint, body, method }) {
    /** @type NodeFetchResponse */
    const resp = await fetch(`${this._baseUrl}${endpoint}`, {
      body: JSON.stringify(body),
      headers: {
        'Authorization': this._auth,
        'Content-Type': 'application/json'
      },
      method
    });

    await this._checkRespStatus(resp);

    if (resp.status === 204) {
      return null;
    }

    return resp.json();
  }

  /**
   * Send an http request with querystring parameters
   * @private
   * @param {Object} opts Method paramaters
   * @param {string} opts.endpoint API endpoint
   * @param {string} [opts.query] Querystring key-value parameters
   * @param {string} opts.method Http request method
   * @returns {Promise<Object>} Promise representing the API response
   */
  async _reqWithQuery({ endpoint, method, query = {} }) {
    const getUrl = new URL(`${this._baseUrl}${endpoint}`);
    Object.keys(query).forEach(
      (key) => query[key] && getUrl.searchParams.append(key, query[key])
    );

    /** @type NodeFetchResponse */
    const resp = await fetch(getUrl, {
      headers: {
        Authorization: this._auth
      },
      method
    });

    await this._checkRespStatus(resp);

    if (resp.status === 204) {
      return null;
    }

    return resp.json();
  }

  /**
   * Upload data coming from a readable stream using http POST request
   * @private
   * @param {Object} opts Method paramaters
   * @param {string} opts.endpoint Upload endpoint
   * @param {ReadableStream} opts.dataStream Readable data stream
   * @param {number} [opts.dataLength] Data length in bytes
   * @returns {Promise<Object>} Promise representing the upload result
   */
  async _upload({ endpoint, dataStream, dataLength }) {
    /** @type NodeFetchResponse */
    const resp = fetch(endpoint, {
      method: 'post',
      headers: {
        'Authorization': this._auth,
        'Content-Length': dataLength
      },
      body: dataStream
    });

    await this._checkRespStatus(resp);

    if (resp.status === 204) {
      return null;
    }

    return resp.json();
  }

  /**
   * Upload a file using an http POST request
   * @param {string} endpoint Upload endpoint
   * @param {string} file Absolute path to the file
   * @returns {Promise<Object>} Promise representing the upload result
   */
  async uploadFile(endpoint, file) {
    const { size: dataLength } = await getFileStats(file);

    const dataStream = fs.createReadStream(file);

    return this._upload({
      endpoint,
      dataLength,
      dataStream
    });
  }

  /**
   * Send a POST http request
   * @param {string} endpoint API endpoint
   * @param {Object} body JSON-like body data
   * @returns {Promise<Object>} Promise representing the API response
   */
  post(endpoint, body) {
    return this._reqWithJSONBody({ endpoint, body, method: 'post' });
  }

  /**
   * Send a PUT http request
   * @param {string} endpoint API endpoint
   * @param {Object} body JSON-like body data
   * @returns {Promise<Object>} Promise representing the API response
   */
  put(endpoint, body) {
    return this._reqWithJSONBody({ endpoint, body, method: 'put' });
  }

  /**
   * Send a GET http request
   * @param {string} endpoint API endpoint
   * @param {Object} [query] Optional query parameters
   * @returns {Promise<Object>} Promise representing the API response
   */
  get(endpoint, query) {
    return this._reqWithQuery({ endpoint, query, method: 'get' });
  }

  /**
   * Send a DELETE http request
   * @param {string} endpoint API endpoint
   * @param {Object} [query] Optional query parameters
   * @returns {Promise<Object>} Promise representing the API response
   */
  delete(endpoint, query) {
    return this._reqWithQuery({ endpoint, query, method: 'delete' });
  }
}

module.exports = Request;
