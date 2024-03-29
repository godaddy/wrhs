const BaseCommand = require('../../utils/base-command');

/* Class representing the env:list command */
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

    const result = await this._sdk.env().list({
      name
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

ListCommand.args = [{ name: 'name', required: true }];

ListCommand.description = 'List all object enviroments';

module.exports = ListCommand;
