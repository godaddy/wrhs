const Command = require('../../base');
const Warehouse = require('warehouse.ai-api-client');

class BuildsCommand extends Command {

  /**
   * Runs the get:build command
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(BuildsCommand);
    const { env, locale } = args; // package is reserved so we don't try to destructure it
    const { pkg, version } = this.parsePackage(args.package);
    const { host, auth } = this.mergeConfig(flags);

    const wrhs = new Warehouse(`https://${auth.user}:${auth.pass}@${host}`);

    // Get build for environment for a given package name
    return new Promise((resolve, reject) => {
      wrhs.builds.get({ env, pkg, locale, version }, (err, build) => {
        if (err) {
          this.renderError('build', args.package, err);
          return reject(err);
        }

        if (flags.json) {
          console.log(JSON.stringify(build));
          return resolve(JSON.stringify(build));
        }

        this.renderResponse(this.parseResponse(build));
        resolve(build);
      });
    });
  }
}

BuildsCommand.description = `Gets information about builds that exist in warehouse.
If no version is specified, the head version will be returned.
`;

BuildsCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package to get builds for'
}, {
  name: 'env',
  required: true,
  description: 'The environment to get builds for'
}, {
  name: 'locale',
  description: 'The specific locale to fetch. Defaults to en-US'
}];

BuildsCommand.flags = Command.flags;

module.exports = BuildsCommand;
