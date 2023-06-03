const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX_N = 1e12
const MAX_M = 1e6;

const $A = TimeLogger.wrap('Preloading A', _ => {
  const max = 6 * MAX_M;
  const A = new Uint32Array(max + 1);

  A[1] = 1;
  let s = 0n;
  let a = 1n;

  const tracer = new Tracer(true);
  for (let k = 2n; k < max + 1; k++) {
    tracer.print(_ => max + 1 - Number(k));
    s += (k - 1n) * a;
    a = s % k;
    A[k] = Number(a);
  }
  tracer.clear();
  return A;
});

function f(N, M, trace) {
  const tracer = new Tracer(trace);

  let total = 0;
  let repeat = 6 * M;

  let totals = new Uint32Array(M);
  const as = new Uint32Array(repeat);

  totals[0] = 1;

  const triangle = n => (n * (n + 1n)) / 2n;

  for (let i = 1; i < repeat && i <= N; i++) {
    tracer.print(_ => N - i);

    const a = $A[i] % M;
    as[i] = a;

    total = (total + a) % M;
    totals[total]++;
  }

  const k = Math.floor(N / repeat);
  if (k > 0) {
    if (k > 1) {
      totals = totals.map(v => k * v);
    }
    const start = k * repeat;
    for (let i = 0; i < repeat; i++) {
      if (start + i > N) {
        break;
      }
      tracer.print(_ => N - (start + i));

      const a = as[i];
      total = (total + a) % M;
      totals[total]++;
    }
  }

  const count = totals.reduce((a, v) => a + triangle(BigInt(v - 1)), 0n);
  tracer.clear();
  return count;
}

assert.strictEqual(f(10, 10), 4n);
assert.strictEqual(TimeLogger.wrap('1E4', _ => f(1e4, 1e3, false)), 97158n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => f(MAX_N, MAX_M, true));
console.log(`Answer is ${answer}`);

