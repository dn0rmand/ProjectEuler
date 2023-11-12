const assert = require('assert');
const { digits: getDigits, TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];

function T(n) {
  const $inner = new Map();

  function makeKey2(a, cmp, remaining) {
    let min = cmp ? remaining[0] : Math.min(a, remaining[0]);
    let next = 0;
    const map = [];
    const add = v => {
      if (map[v] === undefined) {
        map[v] = next++;
      }
      return map[v];
    };
    add(min);
    a -= min;
    let aDone = false;

    const r = remaining.map(v => {
      v -= min;
      if (!cmp && a < v) {
        a = add(a);
        aDone = true;
      }
      v = add(v);
      return v;
    });
    if (!cmp && !aDone) {
      add(a);
    }

    const key = `${cmp ? '+' : a - min}:${r.join('')}`;

    return key;
  }

  function makeKey(a, cmp, remaining) {
    if (cmp === 0) {
      return makeKey2(a, cmp, remaining);
    }

    const counts = remaining.reduce((a, v) => {
      a[v] = (a[v] || 0) + 1;
      return a;
    }, []).filter(v => v);
    const key = `*:${counts.join('-')}`;
    return key;
  }
  const digits = getDigits(n);

  let total = 0;

  function inner(cmp, remaining) {
    if (cmp < 0) {
      return 0;
    }

    if (remaining.length === 0) {
      return cmp > 0 ? 1 : 0;
    }

    const pos = digits.length - remaining.length;
    const a = digits[pos];
    const key = makeKey(a, cmp, remaining);

    let total = $inner.get(key);
    if (total !== undefined) {
      return total;
    }

    total = 0;

    let previous = 10;

    for (let i = remaining.length - 1; i >= 0; i--) {
      let d = remaining[i];
      if (d === previous) {
        continue;
      }
      previous = d;
      const c = cmp === 0 ? d - a : cmp;
      if (c < 0) {
        break;
      }

      const r = remaining.slice();
      r.splice(i, 1);
      total += inner(c, r);
    }

    $inner.set(key, total);

    return total;
  }

  total = inner(0, digits.slice().sort((a, b) => a - b));
  return total;
}

function S1(n) {
  const max = 10 ** n;
  const min = max / 10;

  let total = 0;
  for (let i = min; i < max; i++) {
    total += T(i);
  }
  return total;
}

function getPatterns(n, callback) {

  function patternCount(pattern) {
    function makeKey(value, remaining) {
      let c = remaining[0] ? 1 : 0;
      let f = remaining[0];
      const newRemaining = remaining.map(a => {
        if (a === f) {
          return c;
        } else {
          f = a;
          return ++c;
        }
      });
      return `${value ? 1 : 0}-${newRemaining.join(':')}`;
    }

    function triangle(v) {
      if (v & 1) {
        return ((v - 1) / 2) * v;
      } else {
        return (v / 2) * (v - 1);
      }
    }

    const $memoize = new Map();

    function innerPatternCount(value, remaining) {
      if (remaining.length === 0) {
        return 1; // count++;
      } else {
        const key = makeKey(value, remaining);
        let count = $memoize.get(key);
        if (count !== undefined) {
          return count;
        }
        count = 0;

        let previous = -1;

        for (let i = 0; i < remaining.length; i++) {
          const v = 10 * value + remaining[i];
          if (v === 0 || v === previous) {
            continue;
          }
          previous = v;
          const r = [...remaining];
          r.splice(i, 1);
          count += innerPatternCount(v, r);
        }

        $memoize.set(key, count);
        return count;
      }
    }

    const count = innerPatternCount(0, pattern);
    return triangle(count);
  }

  function innerGetPatterns(pattern, next, max) {
    if (pattern.length > n) {
      return;
    }
    if (pattern.length === n) {
      const count = patternCount(pattern);
      if (count) {
        callback(pattern, BigInt(count));
      }
    } else if (next < 10) {
      let newPattern = [...pattern];
      for (let c = 1; c <= max; c++) {
        newPattern.push(next);
        innerGetPatterns(newPattern, next + 1, next === 0 ? max : c);
      }
    }
  }

  innerGetPatterns([], 0, n);
  innerGetPatterns([], 1, n);
}

function S(N) {
  let total = 0n;

  const n = 9;
  const top = factorials[n];

  const digitalizer = digits => digits.reduce((a, d) => { a[d] += d ? 1 : 0; return a; }, new Uint32Array(10)).filter(c => c);

  getPatterns(N, (pattern, count) => {
    const digits = digitalizer(pattern);
    const digitCounts = digitalizer(digits);
    const divisor = digitCounts.reduce((a, v) => a * factorials[v], factorials[n - digits.length]);
    total += BigInt(top / divisor) * count;
  });

  return total;
}

assert.strictEqual(T(2302), 4);
assert.strictEqual(S(3), 1701n);
assert.strictEqual(TimeLogger.wrap('', _ => S(5)), 2895759n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => S(12));
console.log(`Answer is ${answer}`);
