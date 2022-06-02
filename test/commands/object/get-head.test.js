const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

let resData;

describe('object:get-head', function () {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };

    resData = {
      headVersion: '1.1.1',
      latestVersion: '1.1.2'
    };
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .get('/head/test-object/test')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, resData);
    })
    .stdout()
    .command(['object:get-head', 'test-object', '--env', 'test'])
    .it('runs object:get-head test-object', function (ctx) {
      expect(ctx.stdout).eql(`${JSON.stringify(resData, null, 2)}\n`);
    });
});
