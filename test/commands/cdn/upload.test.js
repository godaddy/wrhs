const path = require('path');
const sinon = require('sinon');
const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');
const fileUtil = require('warehouse.ai-api-client/lib/utils/file');

const FILES_DIR = `${path.join(process.cwd(), 'test', 'fixtures', 'files')}`;
const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

let resDataWithDifferentFingerprints;
let resDataWithSameFingerprint;
let getFilesAndDirSpy;
let createTarballSpy;

describe('cdn:upload', () => {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };
    resDataWithDifferentFingerprints = {
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
    resDataWithSameFingerprint = {
      fingerprints: ['a2b87ccfac6c4eb872aac4273dd68a80.gz'],
      recommended: ['a2b87ccfac6c4eb872aac4273dd68a80/a.js'],
      files: [{ url: `${TEST_URL}/a2b87ccfac6c4eb872aac4273dd68a80/a.js` }]
    };

    getFilesAndDirSpy = sinon.spy(fileUtil, 'getFilesAndDir');
    createTarballSpy = sinon.spy(fileUtil, 'createTarball');
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('upload error', function () {
    let origRequest;

    before(function () {
      origRequest = BaseCommand.Request;
      BaseCommand.Request = class MockRequest {
        uploadFile() {
          return Promise.reject(new Error('upload failed'));
        }
      };
    });

    after(function () {
      BaseCommand.Request = origRequest;
    });

    test
      .stdout()
      .command(['cdn:upload', FILES_DIR, '--expiration', '365d'])
      .catch(/upload failed/)
      .it('re-throws upload error after cleaning up tarball', function () {});
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .post('/cdn?expiration=365d')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .matchHeader('Content-Length', (val) => parseInt(val, 10) === 3072)
        .reply(201, resDataWithDifferentFingerprints);
    })
    .stdout()
    .command(['cdn:upload', FILES_DIR, '--expiration', '365d'])
    .it(
      `runs cdn:upload ${FILES_DIR} without use_single_fingerprint flag`,
      (ctx) => {
        expect(getFilesAndDirSpy.calledWith(FILES_DIR)).to.true;
        expect(createTarballSpy.calledWith(FILES_DIR, ['a.js', 'b.css'])).to
          .true;
        expect(ctx.stdout).equals(
          `${JSON.stringify(resDataWithDifferentFingerprints, null, 2)}\n`
        );
      }
    );

  test
    .nock(TEST_URL, function (api) {
      return api
        .post('/cdn?expiration=365d&use_single_fingerprint=true')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .matchHeader('Content-Length', (val) => parseInt(val, 10) === 3072)
        .reply(201, resDataWithSameFingerprint);
    })
    .stdout()
    .command([
      'cdn:upload',
      FILES_DIR,
      '--expiration',
      '365d',
      '--use_single_fingerprint'
    ])
    .it(
      `runs cdn:upload ${FILES_DIR} with use_single_fingerprint flag`,
      (ctx) => {
        expect(getFilesAndDirSpy.calledWith(FILES_DIR)).to.true;
        expect(createTarballSpy.calledWith(FILES_DIR, ['a.js', 'b.css'])).to
          .true;
        expect(ctx.stdout).equals(
          `${JSON.stringify(resDataWithSameFingerprint, null, 2)}\n`
        );
      }
    );
});
