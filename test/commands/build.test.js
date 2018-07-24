const { test } = require('@oclif/test');
const buildFixture = require('../fixtures/build');
const expectations = require('../expectations/build');
const { getRows, validateRow } = require('../utils');
const fs = require('fs');
const sinon = require('sinon');
const assume = require('assume');

const mockConfig = {
  host: 'warehouse.ai',
  auth: {
    user: 'user',
    pass: 'pass'
  }
};

const generateMockWarehouseRoute = (options = {}) => {
  const {
    path = '/builds/package/dev',
    query = { locale: 'en-US' },
    auth = mockConfig.auth
  } = options;

  return api => {
    api
      .get(path)
      .basicAuth(auth)
      .query(query)
      .reply(200, buildFixture);
  };
};

const validate = ctx => validateRow(getRows(ctx.stdout), expectations);

describe('build', function () {
  before(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough(); // eslint-disable-line no-sync
  });

  after(function () {
    sinon.restore();
  });

  // Fetch a build
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:build', 'package', 'dev'])
    .it('can fetch a build', validate);


  // -u and -p flags
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      auth: { user: 'userFlag', pass: 'passFlag' }
    }))
    .stdout()
    .command(['get:build', 'package', 'dev', '-u', 'userFlag', '-p', 'passFlag'])
    .it('can fetch a build with passed in auth', validate);


  // -h flag
  test
    .nock('https://wrhs.test', generateMockWarehouseRoute())
    .stdout()
    .command(['get:build', 'package', 'dev', '-h', 'wrhs.test'])
    .it('can fetch a build from a passed in host', validate);


  // specific version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/builds/%40scope%2Fpackage/dev/version'
    }))
    .stdout()
    .command(['get:build', '@scope/package@version', 'dev'])
    .it('can fetch a specific version', validate);

  // specific locale
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      query: { locale: 'en-US' }
    }))
    .stdout()
    .command(['get:build', 'package', 'dev', 'en-US'])
    .it('can fetch a specific locale', validate);

  // Fetch raw build information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute())
    .stdout()
    .command(['get:build', 'package', 'dev', '-j'])
    .it('can display raw build information', (ctx) => {
      assume(ctx.stdout).eqls(JSON.stringify(buildFixture) + '\n');
    });
});
