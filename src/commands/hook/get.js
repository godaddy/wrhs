const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the hook:get command */
class GetCommand extends BaseCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(GetCommand);
    const {
      flags: { id },
      args: { name }
    } = cmd;

    const result = await this._sdk.hook().get({
      name,
      id
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

GetCommand.args = [{ name: 'name', required: true }];

GetCommand.description = 'Get an object hook';

GetCommand.flags = {
  id: flags.string({
    char: 'i',
    description: 'hook id',
    required: true
  })
};

module.exports = GetCommand;
