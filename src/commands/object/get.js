const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the object:get command */
class GetCommand extends BaseCommand {
  /**
   * Execute the get command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(GetCommand);
    const {
      flags: { env, version, 'accepted-variants': acceptedVariants },
      args: { name }
    } = cmd;

    const result = await this._request.get(
      `/objects/${encodeURIComponent(name)}`,
      {
        accepted_variants: acceptedVariants,
        env,
        version
      }
    );

    this.log(JSON.stringify(result, null, 2));
  }
}

GetCommand.args = [{ name: 'name', required: true }];

GetCommand.description = 'Get an object from the Warehouse ledger';

GetCommand.flags = {
  'env': flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)'
  }),
  'version': flags.string({
    char: 'v',
    description: 'object version (e.g., v1.2.1)'
  }),
  'accepted-variants': flags.string({
    char: 'a',
    description: 'accepted object variants (e.g., en_US,fr_CA)'
  })
};

module.exports = GetCommand;
