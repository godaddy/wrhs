const Command = require('../../base');

class BuildsCommand extends Command {

  /**
   * Runs the get:build command
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(BuildsCommand);
    const { env, locale, package: packageArg } = args;
    const { pkg, version } = this.parsePackage(packageArg);
    const { wrhsHost, auth } = this.mergeConfig(flags);

    if (!wrhsHost) {
      return this.error(this.missingHostError());
    }

    const wrhs = this.wrhs(auth, { wrhsHost });

    // Get build for environment for a given package name
    return new Promise((resolve, reject) => {
      wrhs.builds.get({ env, pkg, locale, version }, (err, build) => {
        if (err) {
          this.renderError('build', packageArg, err);
          return reject(err);
        }

        if (flags.json) {
          this.log(JSON.stringify(build));
          return resolve(JSON.stringify(build));
        }

        this.renderBuild(build);

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
