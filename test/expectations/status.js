const status = [
  ['key', 'value'],
  ['pkg', '@wrhs/warehouse'],
  ['env', 'dev'],
  ['version', '0.7.1-3'],
  ['previousVersion', '0.7.1-2'],
  ['total', '42'],
  ['error', 'false'],
  ['createDate', '2018-07-11T00:32:53.865Z'],
  ['updateDate', '2018-07-11T00:32:54.049Z'],
  ['complete', 'true']
];

const statusEvent = [
  ['key', '1', '2'],
  ['pkg', '@wrhs/warehouse', '@wrhs/warehouse'],
  ['env', 'dev', 'dev'],
  ['version', '0.7.1-3', '0.7.1-3'],
  ['locale', 'en-US', 'en-US'],
  ['message', 'builtathing', 'builtsomeotherthing'],     // Whitespace is lost when pulling the values out of stdout
  ['details', 'athingwasbuilt', 'anotherthingwasbuilt'], // Whitespace is lost when pulling the values out of stdout
  ['total', '42', '42'],
  ['error', 'false', 'false'],
  ['createDate', '2018-07-11T00:32:53.865Z', '2018-07-11T00:32:00.865Z'],
  ['eventId', 'd2177dd0-eaa2-11de-a572-001b779c76e3', 'd2177dd0-r2d2-11de-a572-001b779c76e3']
];

module.exports = {
  status,
  statusEvent
};
