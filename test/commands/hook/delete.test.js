const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('hook:delete', function () {
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
        .delete('/objects/test-object/hooks/hook-123')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, { deleted: true });
    })
    .stdout()
    .command(['hook:delete', 'test-object', '--id', 'hook-123'])
    .it('runs hook:delete test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"deleted": true');
    });
});
