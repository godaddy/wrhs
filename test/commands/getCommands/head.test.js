/* eslint no-sync: 0 */
const { test } = require('@oclif/test');
const responseFixture = require('../../fixtures/head');
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

const validate = ({ stdout }) => {
  assume(stdout).contains('    @wrhs/warehouse | dev | 0.7.1-3 | de    ');
  assume(stdout).contains('@wrhs/warehouse | dev | 0.7.1-3 | de');
  assume(stdout).contains('CDN:  https://warehouse.ai/wrhs-assets/');

  assume(stdout).contains('Build ID:            @wrhs/warehouse!dev!0.7.1-3!de');
  assume(stdout).contains('Previous build ID:   @wrhs/warehouse!dev!0.7.1-2!de');
  assume(stdout).contains('Rollback build IDs:  {}');

  assume(stdout).contains('Created:  2018-07-11T00:32:47.612Z');
  assume(stdout).contains('Updated:  2018-07-11T00:32:48.622Z');

  assume(stdout).contains('Fingerprints: ');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61     fe61d94740017664cd027625001f0ab6');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61.gz  fe61d94740017664cd027625001f0ab6.gz');

  assume(stdout).contains('Artifacts: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  897aa3b825319c51a7d5d42f351d08c6/warehouse.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    dc41bd94a4b316d3455b7e2959f4d570/last-script.js');

  assume(stdout).contains('Recommended: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  897aa3b825319c51a7d5d42f351d08c6/warehouse.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    dc41bd94a4b316d3455b7e2959f4d570/last-script.js');

  assume(stdout).not.contains('Files: ');

  assume(stdout).contains('    @wrhs/warehouse | dev | 0.7.1-3 | en-US    ');
  assume(stdout).contains('@wrhs/warehouse | dev | 0.7.1-3 | en-US');
  assume(stdout).contains('CDN:  https://warehouse.ai/wrhs-assets/');

  assume(stdout).contains('Build ID:            @wrhs/warehouse!dev!0.7.1-3!en-US');
  assume(stdout).contains('Previous build ID:   @wrhs/warehouse!dev!0.7.1-2!en-US');
  assume(stdout).contains('Rollback build IDs:  {}');

  assume(stdout).contains('Created:  2018-07-11T00:32:53.865Z');
  assume(stdout).contains('Updated:  2018-07-11T00:32:54.049Z');

  assume(stdout).contains('Fingerprints: ');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61     fe61d94740017664cd027625001f0ab6');
  assume(stdout).contains('04c21fde09d60ba86096132c24d1ac61.gz  fe61d94740017664cd027625001f0ab6.gz');

  assume(stdout).contains('Artifacts: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  dc41bd94a4b316d3455b7e2959f4d570/last-script.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    f2ebdb79528153bcd007be8115a0853e/warehouse.js');

  assume(stdout).contains('Recommended: ');
  assume(stdout).contains('4a33bc7e990c4682b0f99c277fef56dd/first-script.js  dc41bd94a4b316d3455b7e2959f4d570/last-script.js');
  assume(stdout).contains('4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js    f2ebdb79528153bcd007be8115a0853e/warehouse.js');
};

describe('get:head', () => {
  beforeEach(function () {
    sinon.stub(fs, 'readFileSync')
      .withArgs(sinon.match('.wrhs'), 'utf8')
      .returns(JSON.stringify(mockConfig));

    fs.readFileSync.callThrough();
  });

  afterEach(function () {
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
    .nock('https://wrhs-host.ai', generateMockWarehouseRoute({
      query: { name: '@scope/package', env: 'dev' }
    }))
    .stdout()
    .command(['get:head', '@scope/package', 'dev'])
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
    .command(['get:build', 'package', 'env'])
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
    .nock('https://wrhs-host.ai', generateMockWarehouseRoute({
      query: { name: '@scope/package', env: 'dev' }
    }))
    .stdout()
    .command(['get:head', '@scope/package', 'dev', '--config', '~/.foo-bar'])
    .it('can override wrhs config file', function () {
      assume(fs.readFileSync).was.calledWith(sinon.match('.foo-bar'), 'utf8');
      assume(fs.readFileSync).was.not.calledWith(sinon.match('.wrhs'), 'utf8');
      validate(...arguments);
    });
});
