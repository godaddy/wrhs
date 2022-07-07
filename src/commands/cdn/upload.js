const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');
const {
  getFilesAndDir,
  createTarball
} = require('warehouse.ai-api-client/lib/utils/file');

/* Class representing the cdn:upload command */
class UploadCommand extends BaseCommand {
  /**
   * Handle files upload to Warehouse CDN
   * @protected
   * @param {string} filepath Path to the file or folder
   * @param {string|number} expiration Files expiration in ms or human readable format
   * @param {string} cdnBaseUrl CDN Base Url that overrides default one configued at server level
   * @returns {Promise<Object>} Promise representing upload response data
   */
  async _handleUpload(filepath, expiration, cdnBaseUrl) {
    const { files, dir } = await getFilesAndDir(filepath);
    const { tarPath, deleteTarball } = await createTarball(dir, files);

    let result;
    let error;
    try {
      result = await this._request.uploadFile({
        endpoint: '/cdn',
        filepath: tarPath,
        query: { expiration, cdn_base_url: cdnBaseUrl }
      });
    } catch (err) {
      error = err;
    }

    deleteTarball();

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Execute the create command
   * @returns {Promise<void>} Promise representing the command execution result
   */
  async run() {
    const cmd = this.parse(UploadCommand);
    const {
      flags: { expiration, cdn_base_url: cdnBaseUrl },
      args: { filepath }
    } = cmd;

    const result = await this._handleUpload(filepath, expiration, cdnBaseUrl);

    this.log(JSON.stringify(result, null, 2));
  }
}

UploadCommand.args = [
  {
    name: 'filepath',
    required: true
  }
];

UploadCommand.description = 'Upload a file to the Warehouse CDN';

UploadCommand.flags = {
  expiration: flags.string({
    char: 'x',
    description:
      'object expiration in human readable format or milliseconds (e.g., 365d, 48h, 1607973280797)'
  }),
  cdn_base_url: flags.string({
    char: 'u',
    description:
      'cdn base url value that overrides default one configued in the server'
  })
};

module.exports = UploadCommand;
