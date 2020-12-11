const fetch = require('node-fetch');

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
   * Validate http response
   * @param {NodeFetchResponse} res HTTP response
   * @returns {Promise<void>} Promise rappresenting the verification result
   */
  async _checkRespStatus(res) {
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(
        `HTTP Error Response: ${res.status} ${res.statusText} ${errorBody}`
      );
    }
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
   * Send a POST http request
   * @param {string} endpoint API endpoint
   * @param {Object} body JSON-like body data
   * @returns {Promise<Object>} Promise rappresenting the API response
   */
  async post(endpoint, body) {
    /** @type NodeFetchResponse */
    const resp = await fetch(`${this._baseUrl}${endpoint}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Authorization': this._basicAuth,
        'Content-Type': 'application/json'
      }
    });

    await this._checkRespStatus(resp);

    return resp.json();
  }
}

module.exports = Request;
