const path = require('path');
const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../src/utils/base-command');

const FILES_DIR = `${path.join(process.cwd(), 'test', 'fixtures', 'files')}`;
const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

let cdnResData;

describe('upload', () => {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };
    cdnResData = {
      fingerprints: [
        'a2b87ccfac6c4eb872aac4273dd68a80.gz',
        'b92c484ac96c7b420d12a4fbcd739eb9.gz'
      ],
      recommended: [
        'a2b87ccfac6c4eb872aac4273dd68a80/a.js',
        'b92c484ac96c7b420d12a4fbcd739eb9/b.css'
      ],
      files: [
        {
          url: `${TEST_URL}/a2b87ccfac6c4eb872aac4273dd68a80/a.js`
        },
        {
          url: `${TEST_URL}/b92c484ac96c7b420d12a4fbcd739eb9/b.css`
        }
      ]
    };
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .post('/cdn?expiration=365d&use_single_fingerprint=true')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .matchHeader('Content-Length', (val) => parseInt(val, 10) === 3072)
        .reply(201, cdnResData);
    })
    .nock(TEST_URL, function (api) {
      return api
        .post('/objects', {
          name: 'test-object',
          version: '2.0.0',
          env: 'development',
          data: cdnResData,
          expiration: '365d',
          variant: 'blue_theme'
        })
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(201, { created: true });
    })
    .stdout()
    .command([
      'upload',
      FILES_DIR,
      'test-object',
      '--version',
      '2.0.0',
      '--env',
      'development',
      '--expiration',
      '365d',
      '--variant',
      'blue_theme',
      '--use_single_fingerprint'
    ])
    .it(`runs upload ${FILES_DIR}`, (ctx) => {
      expect(ctx.stdout).equals(`${JSON.stringify(cdnResData, null, 2)}\n`);
    });
});
