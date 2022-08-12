const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 200000;

const $getPowers = {
  2: [0],
  5: [0],
};

function getPowers(n, p) {
  let a = $getPowers[p][n];
  if (a !== undefined) {
    return a;
  }
  a = 0;
  let v = n;
  while (v % p === 0) {
    a++;
    v /= p;
  }
  $getPowers[p][n] = a;
  return a;
}

const factorial = TimeLogger.wrap('Preloading factorials', (_) => {
  const data = [];

  let p2 = 0;
  let p5 = 0;
  for (let i = 0; i <= MAX; i++) {
    p2 += getPowers(i, 2);
    p5 += getPowers(i, 5);
    data[i] = [0, 0, p2, 0, 0, p5];
  }
  return data;
});

function solve(n, count, trace) {
  const N = factorial[n];

  let total = 0;

  const tracer = new Tracer(trace);

  for (let a = 0; a <= n; a++) {
    tracer.print((_) => n - a);
    const A = factorial[a];
    if (N[2] - A[2] < count || N[5] - A[5] < count) {
      continue;
    }
    for (let b = a; a + b <= n; b++) {
      const c = n - b - a;
      const B = factorial[b];
      const C = factorial[c];

      const p2 = N[2] - (A[2] + B[2] + C[2]);
      const p5 = N[5] - (A[5] + B[5] + C[5]);

      if (p2 >= count && p5 >= count) {
        total++;
        if (a !== b) {
          total++;
        }
      }
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(solve(10, 2), 3);
assert.strictEqual(solve(30, 3), 30);
assert.strictEqual(
  TimeLogger.wrap('', (_) => solve(32000, 12)),
  1896261
);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(MAX, 12, true));
console.log(`Answer is ${answer}`);
