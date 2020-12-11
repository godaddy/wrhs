const { Command, flags } = require('@oclif/command');

const Config = require('../../utils/config');
const Request = require('../../utils/request');

/* Class representing the Create command */
class CreateCommand extends Command {
  /**
   * Create an instance of CreateCommand class
   */
  constructor() {
    super(...arguments);
    this._config = new Config();
    const { baseUrl, username, password } = this._config.load();
    this._request = new Request({ baseUrl, username, password });
  }

  /**
   * Read data from the stdin
   * @private
   * @returns {Promise<string>} Promise rapprsenting the data string read from stdin
   */
  async _readStdin() {
    let data = '';
    return new Promise((resolve, reject) => {
      process.stdin.on('data', (chunk) => {
        data += chunk.toString('utf8');
      });
      process.stdin.on('end', () => {
        resolve(data);
      });
      process.stdin.on('error', reject);
    });
  }

  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(CreateCommand);
    const {
      flags: { env, expiration, variant, version },
      args: { name }
    } = cmd;
    let {
      flags: { data }
    } = cmd;

    if (!data) {
      data = await this._readStdin();
    }

    // TODO(jdaeli): implement
    this.log(env, variant, version, name, data, expiration);
  }
}

CreateCommand.args = [{ name: 'name', required: true }];

CreateCommand.description = 'Create an object in the Warehouse ledger';

CreateCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment',
    default: 'production'
  }),
  version: flags.string({
    char: 'v',
    description: 'object version',
    required: true
  }),
  variant: flags.string({
    char: 'a',
    description: 'object variant',
    default: '_default'
  }),
  expiration: flags.string({ char: 'x', description: 'object expiration' }),
  data: flags.string({ char: 'd', description: 'object data' })
};

module.exports = CreateCommand;
