const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function F(n) {
  function hasBadugi(used) {
    for (const c of used[0]) {
      for (const d of used[1]) {
        if (c === d) {
          continue;
        }
        for (const h of used[2]) {
          if (h === c || h === d) {
            continue;
          }
          for (const s of used[3]) {
            if (s !== c && s !== d && s !== h) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  const makeKey = (used, idx, suit, remaining) => {
    if (idx) {
      return;
    }
    const map = [];
    let next = 0;
    const newUsed = used.map((rs) =>
      rs.map((r) => {
        if (map[r] === undefined) {
          map[r] = next++;
        }
        return map[r];
      })
    );
    const key = `${suit}-${newUsed.map((r) => r.join(':')).join(',')}-${remaining}}`;
    return key;
  };

  const memoize = new Map();

  function get(key) {
    if (key) {
      return memoize.get(key);
    }
  }

  function set(key, value) {
    if (key) {
      memoize.set(key, value);
    }
    return value;
  }

  function add(used, idx, currentSuit, remaining) {
    if (currentSuit > 3) {
      return 0;
    }

    const key = makeKey(used, idx, currentSuit, remaining);

    let total = get(key);
    if (total !== undefined) {
      return total;
    }

    if (remaining === 0) {
      if (currentSuit !== 3) {
        return set(key, 0);
      }
      if (!hasBadugi(used)) {
        return set(key, 0);
      }
      return set(key, 1);
    }

    total = 0;
    const s = used[currentSuit];
    if (s.length !== 0) {
      total += add(used, 0, currentSuit + 1, remaining);
    }
    for (let r = idx; r < 13; r++) {
      if (s.includes[r]) {
        continue;
      }
      s.push(r);
      total += add(used, r + 1, currentSuit, remaining - 1);
      s.pop(r);
    }

    return set(key, total);
  }

  const result = add([[], [], [], []], 0, 0, n);
  return result;
}

function solve() {
  let total = 0;

  for (let n = 4; n <= 13; n++) {
    total += F(n);
  }

  return total;
}

assert.strictEqual(F(4), 17160);
assert.strictEqual(F(5), 514800);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
