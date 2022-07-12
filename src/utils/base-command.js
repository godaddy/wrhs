const { Command } = require('@oclif/command');
const { WarehouseSDK, WarehouseRequest } = require('warehouse.ai-api-client');

const Config = require('./config');

/* Class representing a Base command */
class BaseCommand extends Command {
  /**
   * Create an instance of BaseCommand class
   */
  constructor() {
    super(...arguments);
    this._config = new BaseCommand.Config();
    const { baseUrl, username, password } = this._config.load();
    this._request = new BaseCommand.Request({ baseUrl, username, password });
    // Since v1.2.0 wrhs starts using dedicated SDK
    this._sdk = new BaseCommand.WarehouseSDK({ baseUrl, username, password });
  }
}

BaseCommand.Config = Config;
BaseCommand.Request = WarehouseRequest;
BaseCommand.WarehouseSDK = WarehouseSDK;

module.exports = BaseCommand;
