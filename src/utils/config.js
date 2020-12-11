const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_CONFIG_FILENAME = '.wrhs_next';

class Config {
  constructor({ log }) {
    this._log = log;
    this._filepath =
      // eslint-disable-next-line no-process-env
      process.env.WRHS_NEXT_CONFIG ||
      path.join(os.homedir(), DEFAULT_CONFIG_FILENAME);
  }

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
