const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * @typedef {Object} WrhsNextConfig
 * @property {string} baseUrl Warehouse API base url
 * @property {Object} auth Warehouse auth info
 */

const DEFAULT_CONFIG_FILENAME = '.wrhs_next';

/* Utility class to manage CLI configuration */
class Config {
  /**
   * Create a Config instance
   * @param {Object} opts Constructor parameters
   * @param {function} opts.log Log function 
   */
  constructor({ log }) {
    this._log = log;
    this._filepath =
      // eslint-disable-next-line no-process-env
      process.env.WRHS_NEXT_CONFIG ||
      path.join(os.homedir(), DEFAULT_CONFIG_FILENAME);
  }

  /**
   * Load and verify configuration file
   * @returns {WrhsNextConfig} Warehouse Next configuration object
   */
  load() {
    let data;
    try {
      // eslint-disable-next-line no-sync
      data = fs.readFileSync(this._filepath);
    } catch (err) {
      this._log(`Warehouse config file not found at '${this._filepath}'`);
      throw err;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      this._log('Invalid Warehouse configuration');
      throw err;
    }
  }
}

module.exports = Config;
