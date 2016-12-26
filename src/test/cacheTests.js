require('chai').should();
const expect = require('chai').expect;

const MockTimer = require('./mockTimer');
const Cache = require('../cache');

describe('The cache', function () {
  const mockTimer = new MockTimer();
  const cache = new Cache(mockTimer);
  mockTimer.setTime(0);
  it('persists cache entries', function () {
    const mockTimer = new MockTimer();

    const cache = new Cache(mockTimer);
    const cacheable = {someObj: 'Some value'};
    cache.set('keyVal', cacheable);
    const value = cache.get('keyVal');
    value.should.not.be.undefined;
    value.should.equal(cacheable);
  });

  it('expires entries after time', function () {
    const cache  = new Cache(mockTimer);
    cache.set('expiringVal', {objKey: 'Obj value'});
    expect(cache.get('expiringVal')).to.not.be.undefined;
    // Advance 4 seconds
    mockTimer.setTime(4000);
    cache.sweep();
    expect(cache.get('expiringVal')).to.be.undefined;
  });
});
