const { expect, test } = require('@oclif/test');

describe('upload', () => {
  test
    .stdout()
    .command([
      'upload',
      '/dev/myFilesFolder',
      '--expiration',
      '365d'
    ])
    .it('runs cdn:upload /dev/myFilesFolder', (ctx) => {
      expect(ctx.stdout).to.contain('This is not implemented yet');
    });
});
