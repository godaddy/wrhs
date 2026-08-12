const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('hook:get', function () {
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
        .get('/objects/test-object/hooks/hook-123')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, { id: 'hook-123', url: 'https://hooks.example.com' });
    })
    .stdout()
    .command(['hook:get', 'test-object', '--id', 'hook-123'])
    .it('runs hook:get test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"id": "hook-123"');
      expect(ctx.stdout).to.contain('"url": "https://hooks.example.com"');
    });
});
