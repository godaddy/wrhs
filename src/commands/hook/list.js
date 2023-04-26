const BaseCommand = require('../../utils/base-command');

/* Class representing the hook:list command */
class ListCommand extends BaseCommand {
  /**
   * Execute the get command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(ListCommand);
    const {
      args: { name }
    } = cmd;

    const result = await this._sdk.hook().list({
      name
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

ListCommand.args = [{ name: 'name', required: true }];

ListCommand.description = 'List all object hooks';

module.exports = ListCommand;
