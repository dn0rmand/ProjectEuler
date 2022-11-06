const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

function solve(max, trace) {
  max = BigInt(max);
  let total = 0n;

  const tracer = new Tracer(trace);
  for (let a = 1n; a * a <= max; a++) {
    tracer.print((_) => max - a * a);
    const a2 = a * a;
    const m = max / a2;
    const f = (m * (m + 1n)) / 2n;

    for (let b = 1n; b <= a; b++) {
      const b2 = b * b;
      const top = a2 * b2;
      const bottom = (a + b) ** 2n;
      if (top % bottom !== 0n) {
        continue;
      }
      const c2 = top / bottom;
      if (c2.gcd(a2).gcd(b2) == 1) {
        total += (a2 + b2 + c2) * f;
      }
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(solve(5), 9n);
assert.strictEqual(solve(100), 3072n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(1e9, true));
console.log(`Answer is ${answer}`);
