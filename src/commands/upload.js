const { flags } = require('@oclif/command');

const CDNUploadCommand = require('./cdn/upload');

/* Class representing the upload command */
class UploadCommand extends CDNUploadCommand {
  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(UploadCommand);
    const {
      flags: { expiration },
      args: { filepath }
    } = cmd;

    const result = await this._handleUpload(filepath, expiration);

    this.log('Upload completed and object sucessfully created');
  }
}

UploadCommand.args = [
  {
    name: 'filepath',
    required: true
  }
];

UploadCommand.description =
  'Upload a file to the CDN and create an object in the Warehouse ledger';

UploadCommand.flags = {
  expiration: flags.string({
    char: 'x',
    description:
      'object expiration in human readable format or milliseconds (e.g., 365d, 48h, 1607973280797)'
  })
};

module.exports = UploadCommand;
