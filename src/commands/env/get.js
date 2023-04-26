const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the env:get command */
class GetCommand extends BaseCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(GetCommand);
    const {
      flags: { env },
      args: { name }
    } = cmd;

    const result = await this._sdk.env().get({
      name,
      env
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

GetCommand.args = [{ name: 'name', required: true }];

GetCommand.description = 'Describe an object enviroment';

GetCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)',
    required: true
  })
};

module.exports = GetCommand;
