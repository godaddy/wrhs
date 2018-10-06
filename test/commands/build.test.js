const { test } = require('@oclif/test');
const buildFixture = require('../fixtures/build');
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

const validate = ({ stdout }) => {
  assume(stdout).contains('@wrhs/warehouse | dev | 0.7.1-3 | en-US');
  assume(stdout).contains('CDN:  https://warehouse.ai/wrhs-assets/');

  assume(stdout).contains('Build ID:            @wrhs/warehouse!dev!0.7.1-3!en-US');
  assume(stdout).contains('Previous build ID:   @wrhs/warehouse!dev!0.7.1-2!en-US');
  assume(stdout).contains('Rollback build IDs:  {}');

  assume(stdout).contains('Created:  2018-07-11T00:32:53.865Z');
  assume(stdout).contains('Updated:  2018-07-11T00:32:54.049Z');

  assume(stdout).contains('Fingerprints: ');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61     0b3d0d9fa9f18fe6d74d5a3a1941ccb9');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61.gz  0b3d0d9fa9f18fe6d74d5a3a1941ccb9.gz');

  assume(stdout).contains('Artifacts: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  dc41bd94a4b316d3455b7e2959f4d570/last-script.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    f2ebdb79528153bcd007be8115a0853e/warehouse.js');

  assume(stdout).contains('Recommended: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  dc41bd94a4b316d3455b7e2959f4d570/last-script.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    f2ebdb79528153bcd007be8115a0853e/warehouse.js');

  assume(stdout).contains('Files: ');
  assume(stdout).contains('https://warehouse.ai/wrhs-assets/4a33bc7e990c4682b0f99c277fef56dd/first-script.js');
  assume(stdout).contains('https://warehouse.ai/wrhs-assets/4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js');
  assume(stdout).contains('https://warehouse.ai/wrhs-assets/dc41bd94a4b316d3455b7e2959f4d570/last-script.js');
  assume(stdout).contains('https://warehouse.ai/wrhs-assets/f2ebdb79528153bcd007be8115a0853e/warehouse.js');
};

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

  // No host
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
    .stdout()
    .command(['get:build', 'package', 'env'])
    .it('Outputs an error if there is no wrhs host', (ctx) => {
      assume(ctx.stdout).eqls('Missing warehouse host. Please configure `~/.wrhs` config file, or use the `--host` option.\n');
    });
});
