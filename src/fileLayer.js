'use strict';

const fs = require('fs');
const os = require('os');

class FileLayer {
  constructor(tmpDir) {
    this.tmpDir = tmpDir || `${os.tmpDir()}/FileLayer`;
  }

  initialize(callback) {
    if (!this.tmpDir) {
      throw new Error('Cannot instantiate FileLayer without specifying tmpir');
    }

    fs.mkdir(this.tmpDir, function(err) {
      if (err) {
        return callback(err);
      }

      return callback();
    });
  }
}

module.exports = FileLayer;
