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
    path = '/promote/package/dev/version',
    query = { build: false },
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
  assume(stdout).contains(`Promote triggered successfully. You can use 'wrhs get:build package dev' to confirm that your specific version has been promoted.`);
};

const validateWithBuild = ({ stdout }) => {
  assume(stdout).contains(`Build triggered successfully. You can use 'wrhs get:status package@version dev' to get the status of this build`);
  assume(stdout).contains(`Promote will be triggered upon successful build. You can use 'wrhs get:build package dev' to confirm that your specific version has been promoted.`);
};

describe('promote', function () {
  beforeEach(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough();
  });

  afterEach(function () {
    sinon.restore();
  });

  // Can promote with specific version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['promote', 'package@version', 'dev'])
    .it('can promote with specific version', validate);

  // Fails to promote without specific version supplied
  test
    .stdout()
    .command(['promote', 'package', 'dev'])
    .catch(err => {
      assume(err.oclif.exit).equals(2);
      assume(err.message).contains('Missing package version. Please make sure `package` is in the form `packageName@version` where `version` is the specific version to promote');
    })
    .it('Outputs an error if there is no version supplied as part of package');

  // -u and -p flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['promote', 'package@version', 'dev', '-u', 'userFlag', '-p', 'passFlag'])
    .it('can promote with passed in auth using abbreviated flag names', validate);

  // -user and -pass flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['promote', 'package@version', 'dev', '--user', 'userFlag', '--pass', 'passFlag'])
    .it('can promote with passed in auth using full flag names', validate);

  // -h flag
  test
    .nock('https://wrhs.passedinHost', generateMockWarehouseRoute())
    .stdout()
    .command(['promote', 'package@version', 'dev', '-h', 'wrhs.passedinHost'])
    .it('can promote from a passed in host', validate);

  // -b flag
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      query: { build: true }
    }))
    .stdout()
    .command(['promote', 'package@version', 'dev', '-b'])
    .it('can build and promote', validateWithBuild);

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
    .command(['promote', 'package@version', 'dev'])
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
    .command(['promote', 'package@version', 'dev', '--config', '~/.foo-bar'])
    .it('can override wrhs config file', function () {
      assume(fs.readFileSync).was.calledWith(sinon.match('.foo-bar'), 'utf8');
      assume(fs.readFileSync).was.not.calledWith(sinon.match('.wrhs'), 'utf8');
      validate(...arguments);
    });
});
