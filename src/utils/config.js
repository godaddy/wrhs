const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * @typedef {Object} WrhsNextConfig
 * @property {string} baseUrl Warehouse API base url
 * @property {Object} auth Warehouse auth info
 *
 * @typedef {import('@oclif/dev-cli').}
 */

const DEFAULT_CONFIG_FILENAME = '.wrhs_next';

/* Utility class to manage CLI configuration */
class Config {
  /**
   * Create a Config instance
   */
  constructor() {
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
      throw new Error(`Warehouse config file not found at '${this._filepath}'`);
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      throw new Error('Invalid Warehouse configuration');
    }
  }
}

module.exports = Config;
