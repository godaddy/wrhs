const Command = require('../base');
const { flags: flagUtils } = require('@oclif/command');

class PromoteCommand extends Command {
  /**
   * Runs the promote command for a specific version of a package that has already been built
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(PromoteCommand);
    const { env } = args; // package is reserved so we don't try to destructure it
    const { pkg, version } = this.parsePackage(args.package);
    const { wrhsHost, auth } = this.mergeConfig(flags);

    if (!wrhsHost) {
      return this.error(this.missingHostError());
    }
    if (!version) {
      return this.error(this.missingVersionError('promote'));
    }

    const wrhs = this.wrhs(auth, { wrhsHost });

    // Promotes a build
    return new Promise((resolve, reject) => {
      wrhs.builds.promote({ env, pkg, version, build: flags.build }, (err, response) => {
        if (err) {
          this.renderError('promote', args.package, err);
          return reject(err);
        }
        if (flags.json) {
          this.log(JSON.stringify(response));
          return resolve(JSON.stringify(response));
        }
        if (flags.build) {
          this.log(`Build triggered successfully. You can use 'wrhs get:status ${pkg}@${version} ${env}' to get the status of this build.`);
          this.log(`Promote will be triggered upon successful build. You can use 'wrhs get:build ${pkg} ${env}' to confirm that your speicifc version has been promoted.`);
        } else {
          this.log(`Promote triggered successfully. You can use 'wrhs get:build ${pkg} ${env}' to confirm that your speicifc version has been promoted.`);
        }
        resolve(response);
      });
    });
  }
}

PromoteCommand.description = `Promotes a build for a specific version on warehouse. 
-b Optionally specify to build as well
`;

PromoteCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package to promote. Make sure it is in the form packageName@version where' +
    ' `version` is the specific version to promote. If NOT using the -b optional build flag, please make sure that the specific version is already built.'
}, {
  name: 'env',
  required: true,
  description: 'The environment to promote in'
}];

PromoteCommand.flags = {
  ...Command.flags,
  build: flagUtils.boolean({
    char: 'b',
    default: false,
    description: 'Should build the pacakge before promoting. Defaults to false'
  })
};

module.exports = PromoteCommand;
