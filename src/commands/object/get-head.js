const { flags } = require('@oclif/command');

const BaseCommand = require('../../utils/base-command');

class GetHead extends BaseCommand {
  async run() {
    const cmd = this.parse(GetHead);
    const {
      flags: { env },
      args: { name }
    } = cmd;

    const result = await this._sdk.object().getHead({
      name,
      env
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

GetHead.args = [{ name: 'name', required: true }];

GetHead.description =
  'Get the head object from the Warehouse ledger by environment';

GetHead.flags = {
  env: flags.string({
    char: 'e',
    description: 'object environment (e.g., production, test)'
  })
};

module.exports = GetHead;
