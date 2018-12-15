const { flags: flagUtils, Command } = require('@oclif/command');
const Warehouse = require('warehouse.ai-api-client');
const columns = require('cli-columns');
const link = require('terminal-link');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

const defaultConfigLocation = path.join(os.homedir(), '.wrhs');
const configDocUrl = 'https://github.com/warehouseai/wrhs/blob/master/README.md#configuration';
const seeTheDocsMessage = `Please see ${link('the documentation', configDocUrl)} for more information.`;

class WrhsCommand extends Command {

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

    this.log('');
    this.log(`${chalk.green.bold(build.name)} | ${chalk.green(build.env)} | ${build.version} | ${build.locale}`);
    this.log('CDN: ', chalk.cyan(build.cdnUrl));
    this.log('');
    this.log('Build ID:           ', build.buildId);
    this.log('Previous build ID:  ', build.previousBuildId);
    this.log('Rollback build IDs: ', build.rollbackBuildIds);
    this.log('');
    this.log('Created: ', build.createDate);
    this.log('Updated: ', build.udpateDate);
    this.log('');

    groups.forEach(group => {
      const groupKey = group.toLowerCase();
      if (build[groupKey]) {
        this.log(`${group}: `);
        this.log(columns(build[groupKey].map(item => chalk.yellow(item)), {
          width: group === 'Fingerprints' ? 75 : 100
        }));
        this.log('');
      }
    });
  }

  /**
   * Builds a missing host error message for the correct host
   *
   * @param {bool} isStatus - Does this use the status host?
   * @returns {string} The missing host error message
   */
  missingHostError(isStatus) {
    return `Missing warehouse ${isStatus ? 'status ' : ''}host. Please configure a \`~/.wrhs\` config file or use the \`--${isStatus ? 'status-' : ''}host\` option.\n ${seeTheDocsMessage}`;
  }

  /**
   *
   * @param {string} command The command that encountered an error
   * @param {string} pkg The package the encountered an error
   * @param {Error} error The error
   */
  renderError(command, pkg, error) {
    this.log(`${chalk.bgRed('ERROR:')} Unable to get ${command} information for ${pkg}.`);
    this.log(error);
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
    const { 'status-host': statusHost, host, ...auth } = flags;

    return {
      wrhsHost: host || this.config.hosts && this.config.hosts.wrhs || this.config.host,
      statusHost: statusHost || this.config.hosts && this.config.hosts.status,
      auth: {
        ...this.config.auth,
        ...auth
      }
    };
  }

  /**
   * Creates an instance of the warehouse API client with the given auth and host options
   *
   * @param {Object} auth Auth information
   * @param {string} auth.user username
   * @param {string} auth.pass password
   *
   * @param {Object} hosts host informaiton
   * @param {string} hosts.wrhsHost Warehouse API host
   * @param {string} hosts.statusHost Warehouse status API host
   *
   * @returns {Warehouse} The API client instance
   */
  wrhs(auth, hosts) {
    const config = { uri: `https://${auth.user}:${auth.pass}@${hosts.wrhsHost}` };

    if (hosts.statusHost) {
      config.statusUri = `https://${auth.user}:${auth.pass}@${hosts.statusHost}`;
    }

    return new Warehouse(config);
  }

  /**
   * Attempts to load the configuration file from `~/.wrhs`
   */
  init() {
    let userConfig = {};
    try {
      userConfig = JSON.parse(fs.readFileSync(defaultConfigLocation, 'utf8')); // eslint-disable-line no-sync
    } catch (e) {
      this.debug(e);
      this.log(chalk.red(`Unable to load wrhs config from ${defaultConfigLocation}`));

      if (e.code === 'ENOENT') {
        this.log(seeTheDocsMessage);
      }
    }

    this.config = userConfig;
  }
}

WrhsCommand.flags = {
  'host': flagUtils.string({
    char: 'h',
    description: 'The base url for the warehouse API',
    env: 'WRHS_HOST'
  }),
  'status-host': flagUtils.string({
    char: 's',
    description: 'The base url for the warehouse status API',
    env: 'WRHS_STATUS_HOST'
  }),
  'user': flagUtils.string({
    char: 'u',
    description: 'Username',
    env: 'WRHS_USER'
  }),
  'pass': flagUtils.string({
    char: 'p',
    description: 'Password',
    env: 'WRHS_PASS'
  }),
  'json': flagUtils.boolean({
    char: 'j',
    description: 'Output response data as JSON'
  })
};

module.exports = WrhsCommand;
