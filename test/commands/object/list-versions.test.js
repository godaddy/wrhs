const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('object:list-versions', function () {
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
        .get('/objects/test-object/versions')
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, ['v1.0.0', 'v1.1.0', 'v2.0.0']);
    })
    .stdout()
    .command(['object:list-versions', 'test-object'])
    .it('runs object:list-versions test-object', function (ctx) {
      expect(ctx.stdout).to.contain('"v1.0.0"');
      expect(ctx.stdout).to.contain('"v2.0.0"');
    });
});
