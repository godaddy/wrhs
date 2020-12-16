const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

let resData;

describe('object:get', function () {
  before(function () {
    BaseCommand.Config = class ConfigMock {
      load() {
        return { username: TEST_USR, password: TEST_PWD, baseUrl: TEST_URL };
      }
    };

    resData = [
      {
        name: 'test-object',
        env: 'test',
        version: '1.1.1',
        data: 'this is "a" variant',
        variant: 'a'
      },
      {
        name: 'test-object',
        env: 'test',
        version: '1.1.1',
        data: 'this is "b" variant',
        variant: 'b'
      }
    ];
  });

  test
    .nock(TEST_URL, function (api) {
      return api
        .get(
          '/objects/test-object?env=test&accepted_variants=a,b&version=1.1.1'
        )
        .basicAuth({ user: TEST_USR, pass: TEST_PWD })
        .reply(200, resData);
    })
    .stdout()
    .command([
      'object:get',
      'test-object',
      '--env',
      'test',
      '--accepted-variants',
      'a,b',
      '--version',
      '1.1.1'
    ])
    .it('runs object:get test-object', function (ctx) {
      expect(ctx.stdout).equal(`${JSON.stringify(resData, null, 2)}\n`);
    });
});
