'use strict';

const fs = require('fs');
const os = require('os')
const tmp = require('tmp');

module.exports = {
  directoryExists: function _directoryExists(dirName, callback) {
    fs.stat(dirName, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          return callback(false);
        } else {
          throw new Error(`Unhandled error: ${err}`);
        }
      }

      if (!stats.isDirectory()) {
        throw new Error(`${dirName} is not a directory`);
      }
      return callback(true);
    });
  },

  generateTmpDirName: function generateTmpDirName(callback) {
    tmp.dir((err, folder) => {
      if (err) {
        throw err;
      }
      fs.rmdir(folder, (err) => {
        if (err) {
          throw err;
        }

        return callback(folder);
      });
    });
  }
};
