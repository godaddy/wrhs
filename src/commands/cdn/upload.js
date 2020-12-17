const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');
const { filepathToTarballStream } = require('../../utils/file');

/* Class representing the cdn:upload command */
class UploadCommand extends BaseCommand {
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

    const tarStream = await filepathToTarballStream(filepath);

    const result = this._request._upload({
      endpoint: '/cdn',
      dataStream: tarStream
    });

    this.log(JSON.stringify(result, null, 2));
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
