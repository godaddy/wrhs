const path = require('path');
const sinon = require('sinon');
const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');
const fileUtil = require('warehouse.ai-api-client/lib/utils/file');

const FILES_DIR = `${path.join(process.cwd(), 'test', 'fixtures', 'files')}`;
const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

let createTarballSpy;
let getFilesAndDirSpy;
let resData;

describe('cdn:upload', () => {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };
    resData = {
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

  after(function () {
    sinon.restore();
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .post('/cdn?expiration=365d')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .matchHeader('Content-Length', (val) => parseInt(val, 10) === 3072)
        .reply(201, resData);
    })
    .do(() => {
      getFilesAndDirSpy = sinon.spy(fileUtil, 'getFilesAndDir');
      createTarballSpy = sinon.spy(fileUtil, 'createTarball');
    })
    .stdout()
    .command(['cdn:upload', FILES_DIR, '--expiration', '365d'])
    .it(`runs cdn:upload ${FILES_DIR}`, (ctx) => {
      expect(getFilesAndDirSpy.calledWith(FILES_DIR)).to.true;
      expect(createTarballSpy.calledWith(FILES_DIR, ['a.js', 'b.css'])).to.true;
      expect(ctx.stdout).equals(`${JSON.stringify(resData, null, 2)}\n`);
    });
});
