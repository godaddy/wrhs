const fetch = require('node-fetch');

class Request {
  constructor({ baseUrl, username, password }) {
    this._baseUrl = baseUrl;
    this._auth = this._basicAuth({ username, password });
  }

  _basicAuth({ username, password }) {
    const b64 = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${b64}`;
  }

  async post(endpoint, body) {
    return;
  }
}

module.exports = Request;
