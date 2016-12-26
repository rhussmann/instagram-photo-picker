'use strict';

const expect = require('chai').expect;
const os = require('os');
const util = require('./util');

const FileLayer = require('../fileLayer');
const fs = require('fs');

require('chai').should();

const TMP_DIR = os.tmpDir();
const NEW_TMP_DIR = '';

describe('The file layer', function () {
  it('assumes a temp directory if one is not provided', function() {
    const fileLayer = new FileLayer();
    expect(fileLayer.tmpDir).to.exist;
  });

  it('initializes a temporary directory if not exists', function (done) {
    const fileLayer = new FileLayer(TMP_DIR);
    fileLayer.initialize(function(err) {
      util.directoryExists(TMP_DIR, function(exists) {
        expect(exists).to.be.true;
        done();
      });
    });
  });

  it('initializes a temporary directory when one does not exist', function () {
    util.generateTmpDirName((tmpDir) => {
      util.directoryExists(tmpDir, (exists) => {
        exists.should.be.false;
        const fileLayer = new FileLayer(tmpDir);
        fileLayer.initialize(() => {
          util.directoryExists(tmpDir, (exists) => {
            exists.should.be.true;
          });
        });
      });
    });
  });
});
