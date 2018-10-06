const { flags: flagUtils } = require('@oclif/command');
const request = require('request-promise');
const debug = require('debug')('wrhs');
const qs = require('qs');
const Command = require('../../base');
const chalk = require('chalk');
const columns = require('cli-columns');

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
   */
  render(status) {
    const pkgVer = chalk.green.bold(status.pkg + '@' + status.version);
    const locale = status.locale ? `| ${status.locale} ` : '';
    const complete = status.complete ? `| ${chalk.green.bold('COMPLETE')} ` : '';
    const error = status.error ? `| ${chalk.red.bold('ERROR')} ` : '';

    console.log('');
    console.log(`${pkgVer} | ${chalk.green(status.env)} ${locale}${complete}${error}| total: ${status.total}`);
    console.log('');

    if (status.message) {
      console.log('Message: ', status.message);
      status.details && console.log(columns([' ', status.details]));
      console.log('');
    }

    if (status.previousVersion) {
      console.log('Previous version: ', status.previousVersion);
      console.log('');
    }

    console.log('Created: ', status.createDate);
    status.updateDate && console.log('Updated: ', status.updateDate);
    console.log('');
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
      return console.log('Missing warehouse status host. Please configure `~/.wrhs` config file, or use the `--status-host` option.');
    }

    try {
      const response = await this.getWrhs(host, `/${route}/${encodeURIComponent(pkg)}/${args.env}/${version ? version : ''}`);

      if (flags.json) {
        return console.log(JSON.stringify(response));
      }

      if (flags.events || response.length) {
        return response.forEach(this.render);
      }

      this.render(response);
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
