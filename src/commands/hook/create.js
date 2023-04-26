const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the hook:create command */
class CreateCommand extends BaseCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(CreateCommand);
    const {
      flags: { url },
      args: { name }
    } = cmd;

    await this._sdk.hook().create({
      name,
      url
    });

    this.log('Object env created sucessfully');
  }
}

CreateCommand.args = [{ name: 'name', required: true }];

CreateCommand.description = 'Create an object hook';

CreateCommand.flags = {
  url: flags.string({
    char: 'u',
    description: 'hook url',
    required: true
  })
};

module.exports = CreateCommand;
