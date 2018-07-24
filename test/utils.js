const assume = require('assume');

function getRows(stdout) {
  return stdout.replace(/\s/gm, '') // Remove whitespace
    .split(/.─+.─+./gm)             // Group based on table row dividers
    .filter(i => i.length)          // Remove empty rows (the first and last)
    .map(row => row.split('│').filter(i => i.length)); // Do the same thing (but for columns) to get the cells
}

function validateRow(tableData, expectations) {
  assume(tableData.length).equals(expectations.length);  // Verify the number of rows

  for (let row = 0; row < expectations.length; row++) {
    assume(tableData[row].length).equals(expectations[row].length); // Verify the number of columns

    for (let col = 0; col < expectations[row].length; col++) {
      assume(tableData[row][col]).equals(expectations[row][col]); // Verify the data itself
    }
  }
}

module.exports = {
  getRows,
  validateRow
};
