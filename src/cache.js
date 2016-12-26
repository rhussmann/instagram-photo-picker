'use strict';

var that;
class Cache {
  constructor(timer, expiration) {
    that = this;
    this.store = {};
    this.timer = timer;
    this.valueExpiration = expiration || 3000;

    this.timer.setPeriodicCallback(this.sweep, 100000);
  }

  set(key, value) {
    this.store[key] = {
      entryTime: this.timer.getTime(),
      value: value
    };
  }

  get(key) {
    return this.store[key] ? this.store[key].value : undefined;
  }

  expire(key) {
    delete this.store[key];
  }

  // Use `that` below so sweep can be passed to setInterval()
  // setInterval() clobbers `this`, so we capture that scope in
  // `that`
  sweep() {
    const now = that.timer.getTime();
    const expiringKeys = Object.keys(that.store).filter((key) => {
      return (now - that.store[key].entryTime) > that.valueExpiration;
    });

    expiringKeys.forEach((key) => {
      delete that.store[key];
    });
  }
}

module.exports = Cache;
