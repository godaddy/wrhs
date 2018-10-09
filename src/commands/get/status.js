const { flags: flagUtils } = require('@oclif/command');
const request = require('request-promise');
const debug = require('debug')('wrhs');
const qs = require('qs');
const Command = require('../../base');
const chalk = require('chalk');

class StatusCommand extends Command {

  /**
   * Makes a request to warehouse
   *
   * @param {string} host The warehouse status api host
   * @param {string} apiPath The warehouse api path
   * @param {Object} query Object to be query string-ified
   */
  async getWrhs(host, apiPath, query) {
    query = qs.stringify(query, { encode: false });
    query = query ? '?' + query : '';

    debug('Calling %s', `https://${host}${apiPath}${query}`);
    debug('with config %o', this.config);

    return await request(`https://${host}${apiPath}${query}`, {
      auth: this.config.auth,
      transform: JSON.parse
    });
  }

  /**
   * Takes a status or status event object and renders it
   *
   * @param {Object} status - Status or status event object
   * @param {Object} args - The args the command was run with
   */
  render(status, args) {
    const pkgVer = chalk.green.bold(status.pkg + '@' + status.version);
    const locale = status.locale ? `| ${status.locale} ` : '';
    const complete = status.complete ? `| ${chalk.green.bold('COMPLETE')} ` : '';
    const error = status.error ? `| ${chalk.red.bold('ERROR')} ` : '';

    this.log('');
    this.log(`${pkgVer} | ${chalk.green(status.env)} ${locale}${complete}${error}`);
    this.log('');

    if (status.previousVersion) {
      this.log('Previous version: ', status.previousVersion);
      this.log('');
    }

    this.log('Created: ', status.createDate);
    status.updateDate && this.log('Updated: ', status.updateDate);
    this.log('');

    if (status.error) {
      this.log(`This build encountered an error. For more details run \`wrhs get:status ${args.package} ${args.env} ${args.version ? args.version + ' ' : ''}--events\``);
      this.log('');
    }
  }

  /**
   * Renders the list of events to the console.
   *
   * @param {[Object]} events An array of status events
   * @param {string} locale A locale to filter events by
   */
  renderEvents(events, locale) {
    const firstStatus = events[0];
    const pkgVer = chalk.green.bold(firstStatus.pkg + '@' + firstStatus.version);
    const error = !events.every(event => !event.error) ? `| ${chalk.red.bold('ERROR')} ` : '';

    this.log('');
    this.log(`${pkgVer} | ${chalk.green(firstStatus.env)} ${error}`);
    this.log('');

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
    this.config = this.mergeConfig(flags);
    const { statusHost: host } = this.config;

    if (!host) {
      this.error(this.missingHostError('status'));
    }

    try {
      const response = await this.getWrhs(host, `/${route}/${encodeURIComponent(pkg)}/${args.env}/${version ? version : ''}`);

      if (flags.json) {
        return this.log(JSON.stringify(response));
      }

      if (flags.events || response.length) {
        return this.renderEvents(response, flags.locale);
      }

      this.render(response, args);
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
    }),
    locale: flagUtils.string({
      char: 'l',
      description: 'Only get events for a specific locale',
      dependsOn: ['events']
    })
  }
};

module.exports = StatusCommand;
