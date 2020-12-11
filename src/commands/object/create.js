const { Command, flags } = require('@oclif/command');

const Config = require('../../utils/config');
const Request = require('../../utils/request');

class CreateCommand extends Command {
  constructor() {
    super(...arguments);
    const config = new Config({ log: this.log.bind(this) });
    const { baseUrl, username, password } = config.load();
    this._request = new Request({ baseUrl, username, password });
  }

  async _readStdin() {
    let data = '';
    return new Promise((resolve, reject) => {
      process.stdin.on('data', (chunk) => {
        data += chunk.toString('utf-8');
      });
      process.stdin.on('end', () => {
        resolve(data);
      });
      process.stdin.on('error', reject);
    });
  }

  async run() {
    const cmd = this.parse(CreateCommand);
    const {
      flags: { env, variant, version },
      args: { name }
    } = cmd;
    let {
      flags: { data }
    } = cmd;

    if (!data) {
      data = await this._readStdin();
    }
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
  version: flags.string({ char: 'v', description: 'object version' }),
  expiration: flags.string({ char: 'x', description: 'object expiration' }),
  data: flags.string({ char: 'd', description: 'object data' })
};

module.exports = CreateCommand;
