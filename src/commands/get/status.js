const { flags: flagUtils } = require('@oclif/command');
const Command = require('../../base');

class StatusCommand extends Command {

  /**
   * Runs the get:status command
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(StatusCommand);
    const { pkg, version } = this.parsePackage(args.package);
    const route = flags.events ? 'status-events' : 'status';
    this.config = this.mergeConfig(flags);
    this.config.host = 'https://' + this.config.host;

    try {
      const response = await this.getWrhs(`/${route}/${encodeURIComponent(pkg)}/${args.env}/${version ? version : ''}`);
      let headings;

      if (flags.json) {
        return console.log(JSON.stringify(response));
      }

      if (flags.events || response.length) {
        headings = response.map((event, index) => index + 1);
      }

      this.renderResponse(this.parseResponse(response), headings);
    } catch (e) {
      this.renderError(route, args.package, e);
    }
  }
}

StatusCommand.description = `Get information about the status of a build.
-e can be used to get the more granular status events.
`;

StatusCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package to get status information for'
}, {
  name: 'env',
  required: true,
  description: 'The environment to get status information for'
}];

StatusCommand.flags = {
  ...Command.flags,
  ...{
    events: flagUtils.boolean({
      char: 'e',
      description: 'Should status events be fetched. Defaults to false'
    })
  }
};

module.exports = StatusCommand;
