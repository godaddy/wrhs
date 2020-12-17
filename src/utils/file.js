const { promises: fs } = require('fs');
const path = require('path');
const os = require('os');
const ms = require('ms');
const tar = require('tar');
const tmp = require('tmp');

/**
 * @typedef {import('fs').Stats} FSStats
 * @typedef {Object} CreateTarballResult
 * @property {string} tarPath Absolue path to the tarball file
 * @property {function} deleteTarball Callback method for cleaning up file
 */

/**
 * Resolves ~ in file path
 * @private
 * @param {string} filepath Path to the file or folder
 * @returns {string} Resolved
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
 * Create a tarball and return the path to the file
 * @param {string} filepath Path to the file or folder
 * @returns {Promise<CreateTarballResult>} Promise rappresenting the absolute path to the tarball and a clean up callback
 */
async function createTarball(filepath) {
  let safePath = _resolveHome(filepath);
  if (!path.isAbsolute(safePath)) {
    safePath = path.join(process.cwd(), safePath);
  }
  await getFileStats(safePath);

  const { dirPath, deleteTarball } = await new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, tmpDir, cleanupCb) => {
      if (err) return reject(err);
      resolve({ dirPath: tmpDir, deleteTarball: cleanupCb });
    });
  });

  const tarPath = path.join(dirPath, 'tarball.tgz');

  try {
    await tar.c({ file: tarPath, noDirRecurse: true }, [safePath]);
  } catch (err) {
    deleteTarball();
    throw err;
  }

  return { tarPath, deleteTarball };
}

/**
 * Convert expiration in human readable format to timestamp in milliseconds.
 * @param {string|number} exp Expiration in ms or human readable format
 * @returns {number} Expiration timestamp in milliseconds
 */
function expToTimestamp(exp) {
  if (typeof exp === 'string') {
    return ms(exp);
  }
  return exp;
}

module.exports = {
  createTarball,
  expToTimestamp,
  getFileStats
};
