const { promises: fs } = require('fs');
const path = require('path');
const os = require('os');

/**
 * @typedef {import('fs').Stats} FSStats
 */

/**
 * Resolves ~ in file path
 * @param {string} filepath Path to the file or folder
 * @returns {Promise<FSStats>} Promise rappresenting the file stats
 */
function _resolveHome(filepath) {
  if (filepath[0] === '~') {
      return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Get file stats using fs.stats
 * @param {string} filepath Path to the file or folder
 * @returns {Promise<FSStats>} Promise rappresenting the file stats
 */
async function getFileStats(filepath) {
  let safePath = filepath;
  if (!path.isAbsolute(filepath)) {
    safePath = path.join(process.cwd(), filepath);
  }

  let stats;
  try {
    stats = await fs.stat(filepath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`File not found: ${filepath}`);
    }
    throw err;
  }

  return stats;
}

/**
 * Create a tarball readble stream that can be consumed by the uploader.
 * @param {string} filepath Path to the file or folder
 * @returns {Promise<ReadableStream>} Promise rappresenting the tarball readable stream
 */
async function filepathToTarballStream(filepath) {
  await getFileStats(filepath);
  /** @type ReadableStream */
  return tar.c([filepath]);
}

module.exports = {
  filepathToTarballStream,
  getFileStats
};
