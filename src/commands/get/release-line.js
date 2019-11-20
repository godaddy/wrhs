const chalk = require('chalk');
const Command = require('../../base');

class ReleaseLineCommand extends Command {

  /**
   * Renders release line information for a package.
   *
   * @param {Object} releaseLine - Release line information
   */
  render(releaseLine) {
    this.log('');
    this.log(chalk.green.bold(`${releaseLine.pkg} | ${releaseLine.version}`));
    this.log('');

    if (releaseLine.previousVersion) {
      this.log('Previous version: ', releaseLine.previousVersion);
      this.log('');
    }

    if(releaseLine.dependents){
      this.log('Dependents: ');
      for(let dependant in releaseLine.dependents) {
        this.log(`  - ${dependant}@${releaseLine.dependents[dependant]}`);
      }
      this.log('');
    }
  }

  /**
   * Runs the get:release-line command
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(ReleaseLineCommand);
    const { package: packageArg } = args;
    const { pkg, version } = this.parsePackage(packageArg);
    const { wrhsHost, auth } = this.mergeConfig(flags);

    if (!wrhsHost) {
      return this.error(this.missingHostError());
    }

    const wrhs = this.wrhs(auth, { wrhsHost });

    return new Promise((resolve, reject) => {
      wrhs.releaseLine.get({ pkg, version }, (err, releaseLine) => {
        if (err) {
          this.renderError('release line', packageArg, err);
          return reject(err);
        }

        if (flags.json) {
          this.log(JSON.stringify(releaseLine));
          return resolve(JSON.stringify(releaseLine));
        }

        this.render(releaseLine);

        resolve(releaseLine);
      });
    });
  }
}

ReleaseLineCommand.description = `Gets information about a given release line from warehouse.
`;

ReleaseLineCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package and version (optional) to get the release line for'
}];

ReleaseLineCommand.flags = Command.flags;

module.exports = ReleaseLineCommand;
