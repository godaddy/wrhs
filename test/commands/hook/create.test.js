const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('hook:create', function () {
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
        .post('/objects/test-object/hooks', {
          url: 'https://hooks.example.com'
        })
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(201, {});
    })
    .stdout()
    .command([
      'hook:create',
      'test-object',
      '--url',
      'https://hooks.example.com'
    ])
    .it('runs hook:create test-object', function (ctx) {
      expect(ctx.stdout).to.contain('Object env created sucessfully');
    });
});
