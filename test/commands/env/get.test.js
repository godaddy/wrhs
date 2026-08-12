const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('env:get', function () {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .get('/objects/test-object/envs/production')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, { name: 'test-object', env: 'production' });
    })
    .stdout()
    .command(['env:get', 'test-object', '--env', 'production'])
    .it('runs env:get test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"name": "test-object"');
      expect(ctx.stdout).to.contain('"env": "production"');
    });
});
