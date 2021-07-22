const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('object:set-head', function () {
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
        .put('/objects/test-object/development', {
          head: '2.0.0'
        })
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(204);
    })
    .stdout()
    .command([
      'object:set-head',
      'test-object',
      '--version',
      '2.0.0',
      '--env',
      'development'
    ])
    .it('runs object:set-head test-object', function (ctx) {
      expect(ctx.stdout).to.contain(
        'Head set succesfully to version 2.0.0 in development for test-object'
      );
    });
});
