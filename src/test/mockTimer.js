'use strict';

const Timer = require('../timer');

class MockTimer extends Timer {
  setTime(time) {
    this.time = time;
  }

  getTime() {
    return this.time;
  }

  setPeriodicCallback(callback, period) {}
}

module.exports = MockTimer;
