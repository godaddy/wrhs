const { test } = require('@oclif/test');
const responseFixture = require('../fixtures/head');
const expectations = require('../expectations/head');
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
    auth = mockConfig.auth,
    path = '/builds/-/head',
    query
  } = options;

  return api => {
    api
      .get(path)
      .basicAuth(auth)
      .query(query)
      .reply(200, responseFixture);
  };
};

const validate = ctx => validateRow(getRows(ctx.stdout), expectations);

describe('head', () => {
  before(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough(); // eslint-disable-line no-sync
  });

  after(function () {
    sinon.restore();
  });

  // Fetch a build head
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      query: { name: '@scope/package', env: 'dev' }
    }))
    .stdout()
    .command(['get:head', '@scope/package', 'dev'])
    .it('can fetch the head build', validate);

  // Fetch a build head for specific locale
  // SKIPPED - warehouse.ai-client-api does not support fetching a specific locale for build head
  // test
  //   .nock('https://warehouse.ai', generateMockWarehouseRoute({
  //     query: { name: 'package', env: 'dev', locale: 'de' }
  //   }))
  //   .stdout()
  //   .command(['get:head', 'package', 'dev', 'de'])
  //   .it('can fetch the head build for a given locale', validate);

  // Fetch raw build head information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      query: { name: 'package', env: 'dev' }
    }))
    .stdout()
    .command(['get:head', 'package', 'dev', '-j'])
    .it('can display raw head information', (ctx) => {
      assume(ctx.stdout).eqls(JSON.stringify(responseFixture) + '\n');
    });
});
