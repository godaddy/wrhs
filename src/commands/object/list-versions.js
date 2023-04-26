const BaseCommand = require('../../utils/base-command');

class ListVersions extends BaseCommand {
  async run() {
    const cmd = this.parse(ListVersions);
    const {
      args: { name }
    } = cmd;

    const result = await this._sdk.object().listVersions({
      name
    });

    this.log(JSON.stringify(result, null, 2));
  }
}

ListVersions.args = [{ name: 'name', required: true }];

ListVersions.description = 'List all the object versions';

module.exports = ListVersions;
