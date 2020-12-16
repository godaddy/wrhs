const { Command } = require('@oclif/command');

const Config = require('./config');
const Request = require('./request');

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
  }
}

BaseCommand.Config = Config;
BaseCommand.Request = Request;

module.exports = BaseCommand;
