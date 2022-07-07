const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

/* Class representing the object:set-head command */
class SetHead extends BaseCommand {
  /**
   * Execute the get command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(SetHead);
    const {
      flags: { env, version },
      args: { name }
    } = cmd;

    await this._sdk.object().setHead({
      name,
      env,
      version
    });

    this.log(
      `Head set succesfully to version ${version} in ${env} for ${name}`
    );
  }
}

SetHead.args = [{ name: 'name', required: true }];

SetHead.description = 'Set the object head to a specific version';

SetHead.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)',
    default: 'production'
  }),
  version: flags.string({
    char: 'v',
    description: 'object head version (e.g., v1.2.1)',
    required: true
  })
};

module.exports = SetHead;
