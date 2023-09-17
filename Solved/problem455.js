const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 10n ** 9n;
const MAX = 10n ** 6n;

function f(n) {
  if (n % 10n === 0n) {
    return 0n;
  }
  let i = n;
  while (i) {
    const j = n.modPow(i, MODULO);
    if (i === j) {
      break;
    }
    i = j;
  }
  return i;
}

function sum(max, trace) {
  const tracer = new Tracer(trace);

  let total = 0n;

  for (let n = max; n > 1n; n--) {
    tracer.print(_ => n);
    const v = f(n);
    total += v;
  }
  tracer.clear();
  return total;
}

// https://oeis.org/A165736 with 1e9 instead of 1e10

assert.strictEqual(f(4n), 411728896n);
assert.strictEqual(f(10n), 0n);
assert.strictEqual(f(157n), 743757n);
assert.strictEqual(sum(100n), 43803786139n);
assert.strictEqual(sum(1000n), 442530011399n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => sum(MAX, true));
console.log(`Answer is ${answer}`);
