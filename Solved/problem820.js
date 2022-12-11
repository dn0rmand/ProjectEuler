const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 1e7;
const TEN = 10;

function d(n, k) {
  const rem = TEN.modPow(n - 1, k) * TEN;
  return (rem - (rem % k)) / k;
}

function S(n, trace) {
  let total = 0;

  const tracer = new Tracer(trace);
  for (let k = 1; k <= n; k++) {
    tracer.print((_) => n - k);
    total += d(n, k);
  }
  tracer.clear();
  return total;
}

assert.strictEqual(d(7, 1), 0);
assert.strictEqual(d(7, 2), 0);
assert.strictEqual(d(7, 4), 0);
assert.strictEqual(d(7, 5), 0);
assert.strictEqual(d(7, 3), 3);
assert.strictEqual(d(7, 6), 6);
assert.strictEqual(d(7, 7), 1);

assert.strictEqual(S(7), 10);
assert.strictEqual(S(100), 418);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(MAX, true));
console.log(`Answer is ${answer}`);
