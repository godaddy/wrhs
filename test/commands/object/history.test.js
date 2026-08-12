const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('object:history', function () {
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
        .get('/logs/test-object/production')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, [{ action: 'create', version: 'v1.0.0' }]);
    })
    .stdout()
    .command(['object:history', 'test-object', '--env', 'production'])
    .it('runs object:history test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"action": "create"');
      expect(ctx.stdout).to.contain('"version": "v1.0.0"');
    });
});
