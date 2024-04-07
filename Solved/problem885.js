const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1123455689;

function f(digits) {
  digits = digits.filter(d => d !== 0).sort((a, b) => a - b);
  return digits.reduce((a, d) => (a * 10 + d) % MODULO, 0);
}

const ZERO = "a".charCodeAt(0);

function makeKey(digits) {
  const k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  digits.forEach(d => k[d]++);
  const k2 = k.map(c => String.fromCharCode(ZERO + c));
  return `${k2.join('')}`;
}

function S(n) {
  const memoize = new Map();

  function inner(digits) {
    let k = makeKey(digits);
    let expected = memoize.get(k);
    if (expected !== undefined) {
      return expected;
    }
    let total = 0
    if (digits.length < n) {
      total = 0;
      for (let d = 0; d < 10; d++) {
        total = (total + inner([...digits, d])) % MODULO;
      }
    } else {
      total = f(digits);
    }
    memoize.set(k, total);
    return total;
  }

  const total = inner([]);
  return total;
}

assert.strictEqual(S(1), 45);
assert.strictEqual(S(5), 1543545675 % MODULO);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => S(18));
console.log(`Answer is ${answer}`);