const Command = require('../../base');
const Warehouse = require('warehouse.ai-api-client');
const chalk = require('chalk');

class HeadCommand extends Command {

  /**
   * Runs the get:head command
   *
   * @async
   * @returns {Promise} The result or error
   */
  async run() {
    const { flags, args } = this.parse(HeadCommand);
    const { env /* , locale*/ } = args; // package is reserved so we don't try to destructure it
    const { host, auth } = this.mergeConfig(flags);

    const wrhs = new Warehouse(`https://${auth.user}:${auth.pass}@${host}`);

    // Get build for environment for a given package name
    return new Promise((resolve, reject) => {
      wrhs.builds.heads({ env, pkg: args.package /* , locale*/ }, (err, response) => {
        if (err) {
          this.renderError('build head', args.package, err);
          return reject(err);
        }

        if (flags.json) {
          console.log(JSON.stringify(response));
          return resolve(JSON.stringify(response));
        }

        response.forEach(build => {
          const titleText = ` ${chalk.green.bold(build.name)} | ${chalk.green(build.env)} | ${build.version} | ${build.locale} `;
          const width = (process.stdout.columns || 150) - titleText.length;
          const titleBar = chalk.bgWhite(new Array(Math.floor(width / 2)).fill(' ').join(''));

          console.log(titleBar + titleText + titleBar);

          this.renderBuild(build);
        });

        resolve(response);
      });
    });
  }
}

HeadCommand.description = `Shows information about the head build for the given package in the given environment.
Accepts an optional locale.
`;

HeadCommand.args = [{
  name: 'package',
  required: true,
  description: 'The package to get the head build for'
}, {
  name: 'env',
  required: true,
  description: 'The environment to get the head build for'
}];
// , {
//   name: 'locale',
//   description: 'The locale to get'
// }];

HeadCommand.flags = Command.flags;

module.exports = HeadCommand;
