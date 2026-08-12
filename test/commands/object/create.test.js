const sinon = require('sinon');
const { expect, test } = require('@oclif/test');

const BaseCommand = require('../../../src/utils/base-command');

const TEST_USR = 'test';
const TEST_PWD = 'test';
const TEST_URL = 'https://wrhs.com';

describe('object:create', function () {
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
        .post('/objects', {
          name: 'test-object',
          version: '1.0.0',
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

  describe('stdin input', function () {
    let onStub;

    before(function () {
      onStub = sinon.stub(process.stdin, 'on');
      onStub.withArgs('data').callsArgWith(1, Buffer.from('{"foo": "bar"}'));
      onStub.withArgs('end').callsArgWith(1);
      onStub.withArgs('error').returns(process.stdin);
    });

    after(function () {
      onStub.restore();
    });

    test
      .nock(TEST_URL, function (api) {
        return api
          .post('/objects', {
            name: 'test-object',
            version: '1.0.0',
            data: { foo: 'bar' }
          })
          .basicAuth({ user: TEST_USR, pass: TEST_PWD })
          .reply(201, { created: true });
      })
      .stdout()
      .command(['object:create', 'test-object', '--version', '1.0.0'])
      .it('reads data from stdin when --data flag is omitted', function (ctx) {
        expect(ctx.stdout).to.contain('Object created sucessfully');
      });
  });
});
