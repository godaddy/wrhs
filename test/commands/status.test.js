const { test } = require('@oclif/test');
const { status: statusFixture, statusEvent: statusEventFixture } = require('../fixtures/status');
const { status: statusExpectation, statusEvent: statusEventExpectation } = require('../expectations/status');
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
    path,
    query = false,
    auth = mockConfig.auth,
    fixture = statusFixture
  } = options;

  return api => {
    api
      .get(path)
      .basicAuth(auth)
      .query(query)
      .reply(200, fixture);
  };
};

const validateStatus = ctx => validateRow(getRows(ctx.stdout), statusExpectation);
const validateStatusEvent = ctx => validateRow(getRows(ctx.stdout), statusEventExpectation);

describe('status', () => {
  before(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough(); // eslint-disable-line no-sync
  });

  after(function () {
    sinon.restore();
  });

  // Fetch status information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/status/package/env/'
    }))
    .stdout()
    .command(['get:status', 'package', 'env'])
    .it('can fetch status information', validateStatus);

  // Fetch status event information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/status-events/package/env/',
      fixture: statusEventFixture
    }))
    .stdout()
    .command(['get:status', 'package', 'env', '-e'])
    .it('can fetch status event information', validateStatusEvent);

  // Fetch status information for version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/status/%40scope%2Fpackage/env/version'
    }))
    .stdout()
    .command(['get:status', '@scope/package@version', 'env'])
    .it('can fetch status information for a given version', validateStatus);

  // Fetch status event information for version
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/status-events/%40scope%2Fpackage/env/version',
      fixture: statusEventFixture
    }))
    .stdout()
    .command(['get:status', '@scope/package@version', 'env', '-e'])
    .it('can fetch status event information for a given version', validateStatusEvent);

  // Fetch raw status information
  test
    .nock('https://warehouse.ai', generateMockWarehouseRoute({
      path: '/status/package/env/'
    }))
    .stdout()
    .command(['get:status', 'package', 'env', '-j'])
    .it('can fetch raw status information', (ctx) => {
      assume(ctx.stdout).eqls(JSON.stringify(statusFixture) + '\n');
    });
});
