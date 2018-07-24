const fingerprints = [
  '04c21fde09d60ba86096132c24d1ac61',
  '04c21fde09d60ba86096132c24d1ac61',
  '04c21fde09d60ba86096132c24d1ac61.gz',
  '04c21fde09d60ba86096132c24d1ac61.gz',
  'fe61d94740017664cd027625001f0ab6',
  'fe61d94740017664cd027625001f0ab6',
  'fe61d94740017664cd027625001f0ab6.gz',
  'fe61d94740017664cd027625001f0ab6.gz'
];

const artifacts = [
  '4a33bc7e990c4682b0f99c277fef56dd/first-script.js',
  '4a33bc7e990c4682b0f99c277fef56dd/first-script.js',
  '4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js',
  '4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js',
  '897aa3b825319c51a7d5d42f351d08c6/warehouse.js',
  'dc41bd94a4b316d3455b7e2959f4d570/last-script.js',
  'dc41bd94a4b316d3455b7e2959f4d570/last-script.js',
  'f2ebdb79528153bcd007be8115a0853e/warehouse.js'
];

const recommended = [
  '4a33bc7e990c4682b0f99c277fef56dd/first-script.js',
  '4a33bc7e990c4682b0f99c277fef56dd/first-script.js',
  '4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js',
  '4cc89887f01dc1d02758c0e9a3d0d856/pre-script.js',
  '897aa3b825319c51a7d5d42f351d08c6/warehouse.js',
  'dc41bd94a4b316d3455b7e2959f4d570/last-script.js',
  'dc41bd94a4b316d3455b7e2959f4d570/last-script.js',
  'f2ebdb79528153bcd007be8115a0853e/warehouse.js'
];

module.exports = [
  ['key', 'de', 'en-US'],
  ['env', 'dev', 'dev'],
  ['name', '@wrhs/warehouse', '@wrhs/warehouse'],
  ['buildId', '@wrhs/warehouse!dev!0.7.1-3!de', '@wrhs/warehouse!dev!0.7.1-3!en-US'],
  ['previousBuildId', '@wrhs/warehouse!dev!0.7.1-2!de', '@wrhs/warehouse!dev!0.7.1-2!en-US'],
  ['rollbackBuildIds', '{}', '{}'],
  ['createDate', '2018-07-11T00:32:47.612Z', '2018-07-11T00:32:53.865Z'],
  ['udpateDate', '2018-07-11T00:32:48.622Z', '2018-07-11T00:32:54.049Z'],
  ['version', '0.7.1-3', '0.7.1-3'],
  ['locale', 'de', 'en-US'],
  ['cdnUrl', 'https://warehouse.ai/wrhs-assets/', 'https://warehouse.ai/wrhs-assets/'],
  ['fingerprints', ...fingerprints],
  ['artifacts', ...artifacts],
  ['recommended', ...recommended]
];
