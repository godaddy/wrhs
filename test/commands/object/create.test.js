const { expect, test } = require('@oclif/test');

const CreateCommand = require('../../../src/commands/object/create');

describe('object:create', function () {
  before(function () {
    CreateCommand.Config = class ConfigMock {
      load() {
        return {
          username: 'test',
          password: 'test',
          baseUrl: 'https://wrhs.com'
        };
      }
    };
  });

  test
    .nock('https://wrhs.com', function (api) {
      return api
        .post('/objects', {
          name: 'test-object',
          version: '1.0.0',
          env: 'production',
          data: 'data can be just a string'
        })
        .basicAuth({ user: 'test', pass: 'test' })
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
