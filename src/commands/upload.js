const { flags } = require('@oclif/command');

const CdnUploadCommand = require('./cdn/upload');

/* Class representing the upload command */
class UploadCommand extends CdnUploadCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(UploadCommand);
    const {
      flags: { env, expiration, variant, version },
      args: { filepath, name }
    } = cmd;

    const data = await this._handleUpload(filepath, expiration);

    await this._request.post('/objects', {
      name,
      env,
      expiration,
      variant,
      version,
      data
    });

    this.log(JSON.stringify(data, null, 2));
  }
}

UploadCommand.args = [
  {
    name: 'filepath',
    required: true
  },
  {
    name: 'name',
    required: true
  }
];

UploadCommand.description =
  'Upload a file to the CDN and create an object in the Warehouse ledger';

UploadCommand.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)'
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
  })
};

module.exports = UploadCommand;
