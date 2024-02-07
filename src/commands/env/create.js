const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the env:create command */
class CreateCommand extends BaseCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(CreateCommand);
    const {
      flags: { env },
      args: { name }
    } = cmd;

    await this._sdk.env().create({
      name,
      env
    });

    this.log('Object env created sucessfully');
  }
}

CreateCommand.args = [{ name: 'name', required: true }];

CreateCommand.description = 'Create an object environment';

CreateCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)',
    required: true
  })
};

module.exports = CreateCommand;
