const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the object:history command */
class HistoryCommand extends BaseCommand {
  /**
   * Execute the get command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(HistoryCommand);
    const {
      flags: { env },
      args: { name }
    } = cmd;

    const result = await this._sdk.object().logs({
      name,
      env
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

HistoryCommand.args = [{ name: 'name', required: true }];

HistoryCommand.description = 'Get object history';

HistoryCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)',
    required: true
  })
};

module.exports = HistoryCommand;
