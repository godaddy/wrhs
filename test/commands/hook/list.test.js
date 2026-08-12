const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('hook:list', function () {
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
        .get('/objects/test-object/hooks')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, [{ id: 'hook-123', url: 'https://hooks.example.com' }]);
    })
    .stdout()
    .command(['hook:list', 'test-object'])
    .it('runs hook:list test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"id": "hook-123"');
    });
});
