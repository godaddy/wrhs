const Command = require('../base');
const { flags: flagUtils } = require('@oclif/command');

class TriggerBuildCommand extends Command {

  /**
   * Runs the build command to build the specific version on warehouse without promoting the version
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(TriggerBuildCommand);
    const { env } = args; // package is reserved so we don't try to destructure it
    const { pkg, version } = this.parsePackage(args.package);
    const { wrhsHost, auth } = this.mergeConfig(flags);

    if (!wrhsHost) {
      return this.error(this.missingHostError());
    }
    if (!version) {
      return this.error(this.missingVersionError('build'));
    }

    const wrhs = this.wrhs(auth, { wrhsHost });

    // Get build for environment for a given package name
    return new Promise((resolve, reject) => {
      wrhs.builds.trigger({ env, pkg, version, promote: flags.promote }, (err, response) => {
        if (err) {
          this.renderError('build', args.package, err);
          return reject(err);
        }
        if (flags.json) {
          this.log(JSON.stringify(response));
          return resolve(JSON.stringify(response));
        }
        this.log(`Build triggered successfully. You can use 'wrhs get:status ${pkg}@${version} ${env}' to get the status of this build.`);
        resolve(response);
      });
    });
  }
}

TriggerBuildCommand.description = `Triggers a build for a specific version on warehouse. 
-m Optionally specify if promotion should happen on successful build
`;

TriggerBuildCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package to build. Make sure it is in the form packageName@version where' +
    ' `version` is the specific version to build'
}, {
  name: 'env',
  required: true,
  description: 'The environment to build in'
}];

TriggerBuildCommand.flags = {
  ...Command.flags,
  promote: flagUtils.boolean({
    char: 'm',
    default: false,
    description: 'Should promotion happen on successful build. Defaults to false'
  })
};

module.exports = TriggerBuildCommand;
