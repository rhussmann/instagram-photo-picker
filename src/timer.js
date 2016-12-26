'use strict';

class Timer {
  getTime() {
    return (new Date()).getTime();
  }

  setPeriodicCallback(callback, period) {
    setInterval(callback, period);
  }
}

module.exports = Timer;
