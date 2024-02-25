const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX_N = 10n ** 17n;
const MAX_K = 1000000n

function xorProduct(a, b) {
  let intermediate = 0n;

  while (b) {
    const d = b & 1n;
    intermediate = intermediate ^ (a * d);

    b = b >> 1n;
    a = a << 1n;
  }

  return intermediate;
}

function equation(a, b) {
  const v1 = xorProduct(a, a);
  const v2 = xorProduct(xorProduct(2n, a), b);
  const v3 = xorProduct(b, b);

  return v1 ^ v2 ^ v3;
}

function G(N, K, trace) {

  function getCount(a, b) {
    let count = 0;
    while (b <= N) {
      count++;
      [a, b] = [b, (b + b) ^ a];
    }
    return count;
  }

  const MIN = (a, b) => a < b ? a : b;

  let maxA = MIN(N, 1023n);
  let maxB = MIN(N, 2047n);

  const tracer = new Tracer(trace);

  let total = 1;

  for (let a = 0n; a <= maxA; a++) {
    tracer.print(_ => maxA - a);
    for (let b = a; b <= maxB; b++) {
      if (((a + a) ^ b) <= a) {
        continue;
      }
      const k = equation(a, b);
      if (k >= 1n && k <= K) {
        total += getCount(a, b);
      }
    }
  }

  tracer.clear();

  return total;
}

assert.strictEqual(G(1000n, 100n), 398);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => G(MAX_N, MAX_K, true));
console.log(`Answer is ${answer}`);