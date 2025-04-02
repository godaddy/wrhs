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
      flags: { cdn_base_url: cdnBaseUrl, env, expiration, variant, version, gzip },
      args: { filepath, name }
    } = cmd;

    const data = await this._handleUpload(filepath, expiration, cdnBaseUrl, gzip);

    await this._sdk.object().create({
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
  }),
  cdn_base_url: flags.string({
    char: 'u',
    description:
      'cdn base url value that overrides default one configued in the server'
  }),
  gzip: flags.boolean({
    char: 'g',
    description: 'compress the file using gzip'
  })
};

module.exports = UploadCommand;
