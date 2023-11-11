const assert = require('assert');
const { digits: getDigits, TimeLogger, linearRecurrence } = require('@dn0rmand/project-euler-tools');

function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) {
    f *= i;
  }
  return f;
}

function nPr(n, r) {
  const top = factorial(n);
  if (r === 0) {
    return top;
  }
  const bottom = factorial(r) * factorial(n - r);
  return top / bottom;
}

const $calculs = new Map();

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

  function calculate(remaining) {
    const counts = remaining.reduce((a, v) => {
      a[v] = (a[v] || 0) + 1;
      return a;
    }, []);
    const expected = counts.reduce((a, c) => a * factorial(c), 1);
    return expected;
  }

  function inner(cmp, remaining) {
    if (cmp < 0) {
      return 0;
    }

    if (remaining.length === 0) {
      return cmp > 0 ? 1 : 0;
    }

    const pos = digits.length - remaining.length;
    const a = digits[pos];

    // if (cmp) {
    //   expected = calculate(remaining);
    // }
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

function S2(min, max) {
  let total = 0;
  for (let i = min; i < max; i++) {
    total += T(i);
  }
  return total;
}

assert.strictEqual(T(2302), 4);
assert.strictEqual(S(3), 1701);
assert.strictEqual(TimeLogger.wrap('', _ => S(5)), 2895759);

console.log('Tests passed');
