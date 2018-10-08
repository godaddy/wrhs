const { test } = require('@oclif/test');
const { status: statusFixture, statusEvent: statusEventFixture } = require('../fixtures/status');
const fs = require('fs');
const sinon = require('sinon');
const assume = require('assume');

const mockConfig = {
  hosts: {
    wrhs: 'warehouse.ai',
    status: 'warehouse-status.ai'
  },
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

const validateStatus = ({ stdout }) => {
  assume(stdout).contains(`@wrhs/warehouse@0.7.1-3 | dev | COMPLETE | total: 42`);
  assume(stdout).contains(`Previous version:  0.7.1-2`);
  assume(stdout).contains(`Created:  2018-07-11T00:32:53.865Z`);
  assume(stdout).contains(`Updated:  2018-07-11T00:32:54.049Z`);
};
const validateStatusEvent = ({ stdout }) => {
  assume(stdout).contains(`@wrhs/warehouse@0.7.1-3 | dev | en-US | total: 42`);
  assume(stdout).contains(`Message:  built a thing`);
  assume(stdout).contains(`a thing was built`);
  assume(stdout).contains(`Created:  2018-07-11T00:32:53.865Z`);

  assume(stdout).contains(`@wrhs/warehouse@0.7.1-3 | dev | en-US | total: 42`);
  assume(stdout).contains(`Message:  built some other thing`);
  assume(stdout).contains(`another thing was built`);
  assume(stdout).contains(`Created:  2018-07-11T00:32:00.865Z`);
};

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
    .nock('https://warehouse-status.ai', generateMockWarehouseRoute({
      path: '/status/package/env/'
    }))
    .stdout()
    .command(['get:status', 'package', 'env'])
    .it('can fetch status information', validateStatus);

  // Fetch status event information
  test
    .nock('https://warehouse-status.ai', generateMockWarehouseRoute({
      path: '/status-events/package/env/',
      fixture: statusEventFixture
    }))
    .stdout()
    .command(['get:status', 'package', 'env', '-e'])
    .it('can fetch status event information', validateStatusEvent);

  // Fetch status information for version
  test
    .nock('https://warehouse-status.ai', generateMockWarehouseRoute({
      path: '/status/%40scope%2Fpackage/env/version'
    }))
    .stdout()
    .command(['get:status', '@scope/package@version', 'env'])
    .it('can fetch status information for a given version', validateStatus);

  // Fetch status event information for version
  test
    .nock('https://warehouse-status.ai', generateMockWarehouseRoute({
      path: '/status-events/%40scope%2Fpackage/env/version',
      fixture: statusEventFixture
    }))
    .stdout()
    .command(['get:status', '@scope/package@version', 'env', '-e'])
    .it('can fetch status event information for a given version', validateStatusEvent);

  // Fetch raw status information
  test
    .nock('https://warehouse-status.ai', generateMockWarehouseRoute({
      path: '/status/package/env/'
    }))
    .stdout()
    .command(['get:status', 'package', 'env', '-j'])
    .it('can fetch raw status information', (ctx) => {
      assume(ctx.stdout).eqls(JSON.stringify(statusFixture) + '\n');
    });

  // No status host
  test
    .do(function () {
      fs.readFileSync // eslint-disable-line no-sync
        .withArgs(sinon.match('.wrhs'), 'utf8')
        .returns(JSON.stringify({
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }));
    })
    .stderr()
    .command(['get:status', 'package', 'env'])
    .catch(err => {
      assume(err.oclif.exit).equals(2);
      assume(err.message).contains('Missing warehouse status host. Please configure a `~/.wrhs` config file or use the `--status-host` option.');
    })
    .it('Outputs an error if there is no status host');
});
