const { flags: flagUtils } = require('@oclif/command');
const debug = require('debug')('wrhs');
const thenify = require('tinythen');
const Command = require('../../base');
const chalk = require('chalk');

class StatusCommand extends Command {

  /**
   * Renders the header with general information about the package
   *
   * @param {Object} status - Status information
   * @param {boolean} hasError - Should the error flag be displayed in the header?
   * @param {boolean} isComplete - Is the build complete?
   * @param {Object} [progress={}] - Progress information
   * @param {Number} progress.progress - Percentage of builds complete
   * @param {Number} progress.count - Number of completed builds
   * @param {Number} progress.total - Total number of builds
   */
  renderHeader(status, hasError, isComplete, { progress, count, total } = {}) {
    const pkgVer = chalk.green.bold(`${status.pkg}@${status.version}`);
    const error = hasError ? `| ${chalk.red.bold('ERROR')} ` : '';
    const complete = isComplete ? chalk.green.bold('COMPLETE') : '';
    const progressColor = progress < 100 ? chalk.yellow : chalk.green;
    const prog = `${progressColor(progress)}% (${chalk.cyan(count + '/' + total)})`;

    this.log('');
    this.log(`${pkgVer} | ${chalk.green(status.env)} | ${complete || prog} ${error}`);
    this.log('');
  }

  /**
   * Renders status information for a package.
   *
   * @param {Object} status - Status information
   * @param {Object} progress - Progress information
   * @param {Number} progress.progress - Percentage of builds complete
   * @param {Number} progress.count - Number of completed builds
   * @param {Number} progress.total - Total number of builds
   * @param {Object} args - The args the command was run with
   */
  render(status, progress, args) {
    this.renderHeader(status, status.error, status.complete, progress);

    if (status.previousVersion) {
      this.log('Previous version: ', status.previousVersion);
      this.log('');
    }
    const updateDate = status.updateDate || status.updatedAt;
    const createDate = status.createDate || status.createdAt;

    this.log('Created: ', createDate);
    updateDate && this.log('Updated: ', updateDate);
    this.log('');

    if (status.error) {
      const cmd = chalk.cyan(`\`wrhs get:status ${args.package} ${args.env} ${args.version ? args.version + ' ' : ''}--events\``);
      this.log(`This build encountered an error. For more details run ${cmd}`);
      this.log('');
    }
  }

  /**
   * Renders the list of events.
   *
   * @param {Object[]} events - An array of status events
   * @param {Object} progress - Progress information
   * @param {Number} progress.progress - Percentage of builds complete
   * @param {Number} progress.count - Number of completed builds
   * @param {Number} progress.total - Total number of builds
   * @param {string} locale - A locale to filter events by
   */
  renderEvents(events, progress, locale) {
    const firstStatus = events[0];
    this.renderHeader(firstStatus, !events.every(event => !event.error), progress.progress === 100, progress);

    events.forEach(event => {
      if (locale && event.locale && event.locale.toLowerCase() !== locale.toLowerCase()) return;

      const chalkColor = event.error ? 'red' : 'green';
      const localeLen = event.locale ? event.locale.length : 0;
      let eventlocale = event.locale ? chalk.cyan(event.locale) : '';
      eventlocale += new Array(7 - localeLen).join(' ');

      this.log(`${chalk[chalkColor](event.createDate)} ${eventlocale}: `, event.message);
    });

    this.log('');
  }

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
    const { statusHost, wrhsHost, auth } = this.mergeConfig(flags);

    if (!statusHost) {
      return this.error(this.missingHostError('status'));
    }

    const wrhs = this.wrhs(auth, { wrhsHost, statusHost });

    const get = flags.events ? 'events' : 'get';

    try {
      debug('Getting build status %s for %s@%s in %s', flags.events ? 'events' : 'information', pkg, version || 'HEAD', args.env);
      const response = await thenify(wrhs.status, get, { pkg, env: args.env, version });

      if (flags.json) {
        return this.log(JSON.stringify(response));
      }

      debug('Getting build progress information for %s@%s in %s', pkg, version || 'HEAD', args.env);
      const progress = await thenify(wrhs.status, 'progress', { pkg, env: args.env, version });

      if (flags.events) {
        return this.renderEvents(response, progress, flags.locale);
      }

      this.render(response, progress, args);
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
  events: flagUtils.boolean({
    char: 'e',
    description: 'Should status events be fetched. Defaults to false'
  }),
  locale: flagUtils.string({
    char: 'l',
    description: 'Only get events for a specific locale',
    dependsOn: ['events']
  })
};

module.exports = StatusCommand;
