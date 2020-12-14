const { expect, test } = require('@oclif/test');

const CreateCommand = require('../../../src/commands/object/create');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('object:create', function () {
  before(function () {
    CreateCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .post('/objects', {
          name: 'test-object',
          version: '1.0.0',
          env: 'production',
          data: 'data can be just a string'
        })
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(201, { created: true });
    })
    .stdout()
    .command([
      'object:create',
      'test-object',
      '--version',
      '1.0.0',
      '--data',
      'data can be just a string'
    ])
    .it('runs object:create test-object', function (ctx) {
      expect(ctx.stdout).to.contain('Object created sucessfully');
    });
});
