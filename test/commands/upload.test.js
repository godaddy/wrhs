const { expect, test } = require('@oclif/test');

describe('upload', () => {
  test
    .stdout()
    .command([
      'upload',
      '/dev/myFilesFolder',
      'test-object',
      '--version',
      '2.0.0',
      '--env',
      'development',
      '--expiration',
      '365d',
      '--variant',
      'blue_theme'
    ])
    .it('runs upload /dev/myFilesFolder test-object', (ctx) => {
      expect(ctx.stdout).to.contain('This is not implemented yet');
    });
});
