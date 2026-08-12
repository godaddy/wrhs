const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sinon = require('sinon');

const Config = require('../../src/utils/config');

describe('Config', function () {
  afterEach(function () {
    sinon.restore();
    delete process.env.WRHS_NEXT_CONFIG;
  });

  describe('constructor', function () {
    it('uses default config path based on home directory', function () {
      const config = new Config();
      assert.strictEqual(config._filepath, path.join(os.homedir(), '.wrhs'));
    });

    it('uses WRHS_NEXT_CONFIG env var when set', function () {
      process.env.WRHS_NEXT_CONFIG = '/custom/path/.wrhs';
      const config = new Config();
      assert.strictEqual(config._filepath, '/custom/path/.wrhs');
    });
  });

  describe('load()', function () {
    it('returns parsed config from file', function () {
      const configData = {
        baseUrl: 'https://wrhs.com',
        username: 'user',
        password: 'pass'
      };
      sinon.stub(fs, 'readFileSync').returns(JSON.stringify(configData));
      const config = new Config();
      assert.deepStrictEqual(config.load(), configData);
    });

    it('throws when config file is not found', function () {
      sinon.stub(fs, 'readFileSync').throws(new Error('ENOENT'));
      const config = new Config();
      assert.throws(() => config.load(), /Warehouse config file not found at/);
    });

    it('throws when config file contains invalid JSON', function () {
      sinon.stub(fs, 'readFileSync').returns('not valid json {{ bad');
      const config = new Config();
      assert.throws(() => config.load(), /Invalid Warehouse configuration/);
    });
  });
});
