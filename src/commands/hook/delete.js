const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the hook:delete command */
class DeleteCommand extends BaseCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(DeleteCommand);
    const {
      flags: { id },
      args: { name }
    } = cmd;

    const result = await this._sdk.env().delete({
      name,
      id
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

DeleteCommand.args = [{ name: 'name', required: true }];

DeleteCommand.description = 'Delete a hook';

DeleteCommand.flags = {
  id: flags.string({
    char: 'i',
    description: 'hook id',
    required: true
  })
};

module.exports = DeleteCommand;
