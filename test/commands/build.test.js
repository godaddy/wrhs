/* eslint no-sync: 0 */
const { test } = require('@oclif/test');
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
    path = '/builds/package/dev/version',
    query = { promote: false },
    auth = mockConfig.auth
  } = options;

  return api => {
    api
      .patch(path)
      .basicAuth(auth)
      .query(query)
      .reply(204);
  };
};

const validate = ({ stdout }) => {
  assume(stdout).contains(`Build triggered successfully. You can use 'wrhs get:status package@version dev' to get the status of this build`);
};

describe('build', function () {
  beforeEach(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough();
  });

  afterEach(function () {
    sinon.restore();
  });

  // Trigger a build with specific version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['build', 'package@version', 'dev'])
    .it('can trigger build with specific version', validate);

  // Fails to trigger a build without specific version supplied
  test
    .stdout()
    .command(['build', 'package', 'dev'])
    .catch(err => {
      assume(err.oclif.exit).equals(2);
      assume(err.message).contains('Missing package version. Please make sure `package` is in the form `packageName@version` where `version` is the specific version to build');
    })
    .it('Outputs an error if there is no version supplied as part of package');

  // -u and -p flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['build', 'package@version', 'dev', '-u', 'userFlag', '-p', 'passFlag'])
    .it('can trigger build with passed in auth using abbreviated flag names', validate);

  // -user and -pass flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['build', 'package@version', 'dev', '--user', 'userFlag', '--pass', 'passFlag'])
    .it('can trigger build with passed in auth using full flag names', validate);

  // -h flag
  test
    .nock('https://wrhs.passedinHost', generateMockWarehouseRoute())
    .stdout()
    .command(['build', 'package@version', 'dev', '-h', 'wrhs.passedinHost'])
    .it('can trigger a build from a passed in host', validate);

  // -m flag
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      query: { promote: true }
    }))
    .stdout()
    .command(['build', 'package@version', 'dev', '-m'])
    .it('can trigger a build with promote', validate);

  // Host fallback
  test
    .do(function () {
      fs.readFileSync
        .withArgs(sinon.match('.wrhs'), 'utf8')
        .returns(JSON.stringify({
          host: 'wrhs-host-fallback.ai',
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .nock('https://wrhs-host-fallback.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['build', 'package@version', 'dev'])
    .it('fallsback to the `host` config', validate);

  // Different Host File
  test
    .do(function () {
      fs.readFileSync
        .withArgs(sinon.match('.foo-bar'), 'utf8')
        .returns(JSON.stringify({
          host: 'wrhs-host-fallback.ai',
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .nock('https://wrhs-host-fallback.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['build', 'package@version', 'dev', '--config', '~/.foo-bar'])
    .it('can override wrhs config file', function () {
      assume(fs.readFileSync).was.calledWith(sinon.match('.foo-bar'), 'utf8');
      assume(fs.readFileSync).was.not.calledWith(sinon.match('.wrhs'), 'utf8');
      validate(...arguments);
    });
});
