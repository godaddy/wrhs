const { flags: flagUtils, Command } = require('@oclif/command');
const request = require('request-promise');
const debug = require('debug')('wrhs');
const columns = require('cli-columns');
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
   * Renders build information
   *
   * @param {Object} build - The build information returned from warehouse
   */
  renderBuild(build) {
    const groups = ['Fingerprints', 'Artifacts', 'Recommended', 'Files'];

    console.log('');
    console.log(`${chalk.green.bold(build.name)} | ${chalk.green(build.env)} | ${build.version} | ${build.locale}`);
    console.log('CDN: ', chalk.cyan(build.cdnUrl));
    console.log('');
    console.log('Build ID:           ', build.buildId);
    console.log('Previous build ID:  ', build.previousBuildId);
    console.log('Rollback build IDs: ', build.rollbackBuildIds);
    console.log('');
    console.log('Created: ', build.createDate);
    console.log('Updated: ', build.udpateDate);
    console.log('');

    groups.forEach(group => {
      const groupKey = group.toLowerCase();
      if (build[groupKey]) {
        console.log(`${group}: `);
        console.log(columns(build[groupKey].map(item => chalk.yellow(item)), {
          width: group === 'Fingerprints' ? 75 : 100
        }));
        console.log('');
      }
    });
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
