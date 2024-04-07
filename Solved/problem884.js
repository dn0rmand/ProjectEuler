const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');
const MAX = 10n ** 17n;

TimeLogger.wrap('', _ => {
  const cubes = (function () {
    let cubes = [];
    for (let i = 1n; ; i++) {
      const v = i ** 3n;
      if (v > MAX) {
        break;
      }
      cubes.push(v);
    }
    return cubes;
  })();

  function CBRT(n) {
    let min = 0;
    let max = cubes.length - 1;
    while (min <= max) {
      const middle = Math.floor((min + max) / 2);
      const cube = cubes[middle];
      const diff = cube - n;
      if (diff > 0) {
        max = middle - 1;
      } else if (diff < 0) {
        min = middle + 1
      } else {
        return cube;
      }
    }
    min = Math.max(0, Math.min(min, max));
    return cubes[min];
  }

  const $D = new Map();

  function D(n) {
    if (n < 1) {
      return 0;
    }
    let d = $D.get(n);
    if (d !== undefined) {
      return d;
    }

    const c = CBRT(n);

    d = D(n - c) + 1;
    $D.set(n, d);
    return d;
  }

  const $S = new Map();

  function _S(n) {
    if (n === 0n) {
      return 0n;
    }
    let v = $S.get(n);
    if (v !== undefined) {
      return v;
    }
    const c = CBRT(n);
    v = _S(c - 1n) + _S(n - c) + n - c + 1n;
    $S.set(n, v);
    return v;
  }

  function prepare() {
    for (const c of cubes) {
      _S(c - 1n);
    }
  }

  function S(n) {
    prepare();
    return _S(n - 1n);
  }


  // assert.strictEqual(D(100n), 4);
  // assert.strictEqual(S(100n), 512n);

  // console.log('Tests passed');

  const answer = TimeLogger.wrap('', _ => S(MAX));
  console.log(`Answer is ${answer}`);
});