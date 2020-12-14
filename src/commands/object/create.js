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
    this._config = new CreateCommand.Config();
    const { baseUrl, username, password } = this._config.load();
    this._request = new CreateCommand.Request({ baseUrl, username, password });
  }

  /**
   * Read data from the stdin
   * @private
   * @returns {Promise<string>} Promise representing the data string read from stdin
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

    const { created } = await this._request.post('/objects', {
      name,
      env,
      expiration,
      variant,
      version,
      data
    });

    if (!created) {
      return this.error('Unknown error: failed to create object');
    }

    this.log('Object created sucessfully');
  }
}

CreateCommand.args = [{ name: 'name', required: true }];

CreateCommand.description = 'Create an object in the Warehouse ledger';

CreateCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)',
    default: 'production'
  }),
  version: flags.string({
    char: 'v',
    description: 'object version (e.g., v1.2.1)',
    required: true
  }),
  variant: flags.string({
    char: 'a',
    description: 'object variant (e.g., en_US)'
  }),
  expiration: flags.string({
    char: 'x',
    description:
      'object expiration in human readable format or milliseconds (e.g., 365d, 48h, 1607973280797)'
  }),
  data: flags.string({
    char: 'd',
    description: 'object data (e.g., \'{ "foo": "bar" }\')'
  })
};

CreateCommand.Config = Config;
CreateCommand.Request = Request;

module.exports = CreateCommand;
