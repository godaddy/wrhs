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
      flags: { env, version, fromEnv },
      args: { name }
    } = cmd;

    if (version) {
      await this._sdk.object().setHead({
        name,
        env,
        version
      });

      this.log(
        `Head set succesfully to version ${version} in ${env} for ${name}`
      );
    } else if (fromEnv) {
      await this._sdk.object().setHead({
        name,
        env,
        fromEnv
      });

      this.log(
        `Head set succesfully from env ${fromEnv} in ${env} for ${name}`
      );
    } else {
      this.log('Flag -e or -f is required');
    }
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
    required: false
  }),
  fromEnv: flags.string({
    char: 'f',
    description: 'use head version for env',
    required: false
  })
};

module.exports = SetHead;
