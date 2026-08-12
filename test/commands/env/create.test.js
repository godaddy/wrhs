const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('env:create', function () {
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
        .post('/objects/test-object/envs', { env: 'production' })
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(201, {});
    })
    .stdout()
    .command(['env:create', 'test-object', '--env', 'production'])
    .it('runs env:create test-object', function (ctx) {
      expect(ctx.stdout).to.contain('Object env created sucessfully');
    });
});
