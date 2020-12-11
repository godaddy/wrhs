const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_CONFIG_FILENAME = '.wrhs_next';

class Config {
  constructor({ log }) {
    this._log = log;
    this._filepath =
      process.env.WRHS_NEXT_CONFIG ||
      path.join(os.homedir(), DEFAULT_CONFIG_FILENAME);
  }

  load() {
    let data;
    try {
      data = fs.readFileSync(this._filepath);
    } catch (err) {
      this._log(`Warehouse config file not found at '${this._filepath}'`);
      process.exit(1);
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      console.log(err)
      this._log('Invalid Warehouse configuration');
      process.exit(1);
    }
  }
}

module.exports = Config;
