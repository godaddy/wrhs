/* eslint no-sync: 0 */
const { test } = require('@oclif/test');
const releaseLineFixture = require('../../fixtures/release-line');
const fs = require('fs');
const sinon = require('sinon');
const assume = require('assume');
assume.use(require('assume-sinon'));

const mockConfig = {
  host: 'warehouse.ai',
  auth: {
    user: 'user',
    pass: 'pass'
  }
};

const generateMockWarehouseRoute = (options = {}) => {
  const {
    path = '/release-line/package/1.0.0',
    auth = mockConfig.auth
  } = options;

  return api => {
    api
      .get(path)
      .basicAuth(auth)
      .reply(200, releaseLineFixture);
  };
};

const validate = ({ stdout }) => {
  assume(stdout).contains('@wrhs/warehouse | 1.0.0');

  assume(stdout).contains('Previous version:  0.9.0');

  assume(stdout).contains('Dependents: ');
  assume(stdout).contains('@wrhs/dependent@5.0.0');
  assume(stdout).contains('@wrhs/dependent2@3.0.0');
};

describe('get:release-line', function () {
  beforeEach(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough();
  });

  afterEach(function () {
    sinon.restore();
  });

  // Fetch a release line
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:release-line', 'package@1.0.0'])
    .it('can fetch a release line', validate);

  // -u and -p flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['get:release-line', 'package@1.0.0', '-u', 'userFlag', '-p', 'passFlag'])
    .it('can fetch a release line with passed in auth', validate);

  // -h flag
  test
    .nock('https://wrhs.test', generateMockWarehouseRoute())
    .stdout()
    .command(['get:release-line', 'package@1.0.0', '-h', 'wrhs.test'])
    .it('can fetch a release line from a passed in host', validate);

  // no version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({ path: '/release-line/package'}))
    .stdout()
    .command(['get:release-line', 'package'])
    .it('can fetch a release line (no version)', validate);

  // Fetch raw release line information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:release-line', 'package@1.0.0', '-j'])
    .it('can display raw release line information', (ctx) => {
      assume(ctx.stdout).eqls(JSON.stringify(releaseLineFixture) + '\n');
    });

  // Host fallback
  test
    .do(function () {
      fs.readFileSync
        .withArgs(sinon.match('.wrhs'), 'utf8')
        .returns(JSON.stringify({
          host: 'wrhs-host.ai',
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .nock('https://wrhs-host.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:release-line', 'package@1.0.0'])
    .it('fallsback to the `host` config', validate);

  // No host
  test
    .do(function () {
      fs.readFileSync
        .withArgs(sinon.match('.wrhs'), 'utf8')
        .returns(JSON.stringify({
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .stdout()
    .command(['get:release-line', 'package@1.0.0'])
    .catch(err => {
      assume(err.oclif.exit).equals(2);
      assume(err.message).contains('Missing warehouse host. Please configure a `~/.wrhs` config file, use the `--config` option, or use the `--host` option.');
    })
    .it('Outputs an error if there is no wrhs host');


  // Different Host File
  test
    .do(function () {
      fs.readFileSync
        .withArgs(sinon.match('.foo-bar'), 'utf8')
        .returns(JSON.stringify({
          host: 'wrhs-host.ai',
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .nock('https://wrhs-host.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:release-line', 'package@1.0.0', '--config', '~/.foo-bar'])
    .it('can override wrhs config file', function () {
      assume(fs.readFileSync).was.calledWith(sinon.match('.foo-bar'), 'utf8');
      assume(fs.readFileSync).was.not.calledWith(sinon.match('.wrhs'), 'utf8');
      validate(...arguments);
    });
});
