const { flags: flagUtils, Command } = require('@oclif/command');
const request = require('request-promise');
const debug = require('debug')('wrhs');
const table = require('tty-table');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');
const qs = require('qs');

const defaultConfigLocation = path.join(os.homedir(), '.wrhs');

class WrhsCommand extends Command {

  /**
   * Makes a request to warehouse
   *
   * @param {string} apiPath The warehouse api path
   * @param {Object} query Object to be query string-ified
   */
  async getWrhs(apiPath, query) {
    query = qs.stringify(query, { encode: false });
    query = query ? '?' + query : '';

    debug('Calling %s', `${this.config.host}${apiPath}${query}`);
    debug('with config %o', this.config);

    return await request(`${this.config.host}${apiPath}${query}`, {
      auth: this.config.auth,
      transform: JSON.parse
    });
  }

  /**
   * Seperate the package name and version from `@scope/packageName@version`
   *
   * @param {string} pkgArg Package information in the format of @scope/packageName@version
   * @returns {{ pkg: string, version: (string|undefined) }} The package name and version
   */
  parsePackage(pkgArg) {
    // We don't care about the first character. If it is an `@`, it is scope.
    const atIndex = pkgArg.indexOf('@', 1);
    const version = ~atIndex ? pkgArg.slice(atIndex + 1) : void 0;
    const pkg = !~atIndex ? pkgArg : pkgArg.slice(0, atIndex);

    return { pkg, version };
  }

  /**
   * Takes the response from warehouse and formats it to be output as a table
   *
   * @param {(Object|Object[])} response The json response from wrhs
   * @returns {Array[]} An array of arrays. The columns and rows to output
   */
  parseResponse(response) {
    if (Array.isArray(response)) {
      const rows = Object.keys(response[0]).map(key => [key]);
      rows.forEach(row => {
        response.forEach(obj => row.push(obj[row[0]]));
      });

      return rows;
    }

    return Object.entries(response);
  }

  /**
   * Takes rows and headings and outputs them as a table
   *
   * @param {*[]} data The rows and columns of data to output
   * @param {string[]} headings The additional column headings
   */
  renderResponse(data, headings = ['value']) {
    const dataCol = {
      align: 'left',
      width: Math.floor((process.stdout.columns - 30) / headings.length),
      formatter: function (value) {
        // There is a bug in tty-table where new lines are not treated as whitespace.
        // This requires the `\t` for proper formatting, and can produce extra line breaks.
        if (Array.isArray(value)) {
          return value.join('\t\n');
        }

        if (typeof value === 'object') {
          return JSON.stringify(value);
        }

        return value;
      }
    };
    const header = [{
      value: 'key',
      align: 'left',
      width: 20
    }];

    headings.forEach(heading => header.push({ value: heading, ...dataCol }));

    console.log(table(header, data).render());
  }

  /**
   *
   * @param {string} command The command that encountered an error
   * @param {string} pkg The package the encountered an error
   * @param {Error} error The error
   */
  renderError(command, pkg, error) {
    console.log(`${chalk.bgRed('ERROR:')} Unable to get ${command} information for ${pkg}.`);
    console.log(error);
  }

  /**
   * Merges the configuration flags (and environment variables via oclif) with the config from `~/.wrhs`
   *
   * @param {Object} flags The flags passed into the command
   * @param {string} flags.host The warehouse host
   * @param {string} flags.user Username for auth
   * @param {string} flags.pass Password for auth
   * @returns {Object} The merged configuration object
   */
  mergeConfig(flags) {
    const { host, ...auth } = flags;

    return {
      host: host || this.config.host,
      auth: {
        ...this.config.auth,
        ...auth
      }
    };
  }

  /**
   * Attempts to load the configuration file from `~/.wrhs`
   */
  init() {
    let userConfig = {};
    try {
      userConfig = JSON.parse(fs.readFileSync(defaultConfigLocation, 'utf8')); // eslint-disable-line no-sync
    } catch (e) {
      console.log(chalk.red(`Unable to load wrhs config from ${defaultConfigLocation}`), e);
    }

    this.config = userConfig;
  }
}

WrhsCommand.flags = {
  host: flagUtils.string({
    char: 'h',
    description: 'The base url for the warehouse API',
    env: 'WRHS_HOST'
  }),
  user: flagUtils.string({
    char: 'u',
    description: 'Username',
    env: 'WRHS_USER'
  }),
  pass: flagUtils.string({
    char: 'p',
    description: 'Password',
    env: 'WRHS_PASS'
  }),
  json: flagUtils.boolean({
    char: 'j',
    description: 'Output response data as JSON'
  })
};

module.exports = WrhsCommand;
