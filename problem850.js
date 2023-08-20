const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 977676779;
const MODULO_N = BigInt(MODULO);
const MAX = 33557799775533;

const $f = new Map();

function f(k, n) {
  const key = `${k}:${n}`;
  let result = $f.get(key);
  if (result !== undefined) {
    return result;
  }

  let total = 0;
  for (let i = 1; i < n; i++) {
    let x = i.modPow(k, n);
    total += x;
  }

  result = total / n;

  $f.set(key, result);
  return result;
}

function F(k, N, diff, tracer) {
  if (k === 1) {
    const n = BigInt(N);
    const t = ((n * (n - 1n)) / 2n) % MODULO_N;

    return t.divise(2n, 10);
  }

  let total = 0;
  for (let n = 2; n <= N; n++) {
    tracer.print(_ => `${k}:${diff} - ${N - n}`);
    const v1 = f(k, n);
    total = (total + v1) % MODULO;
  }

  return total;
}

function S(N, trace) {
  let previous = F(1, N);
  let total = previous;

  const tracer = new Tracer(trace);

  let diff = '?';

  for (let k = 3; k <= N; k += 2) {
    const subTotal = F(k, N, diff, tracer);
    total = (total + subTotal) % MODULO;

    diff = previous - subTotal;
    if (diff === 0) {
      const count = Math.floor((N - k) / 2);
      total = (total + count.modMul(previous, MODULO)) % MODULO;
      break;
    } else {
      previous = subTotal;
    }
  }

  tracer.clear();
  return total;
}

assert.strictEqual(f(5, 10), 4.5);
assert.strictEqual(f(7, 1234), 616.5);

assert.strictEqual(S(10), 100.5);
assert.strictEqual(TimeLogger.wrap('', _ => S(1000, true)), 123687804);
assert.strictEqual(TimeLogger.wrap('', _ => S(2000, true)), 993801574 % MODULO);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => S(33557799775533, true));
console.log(`Answer is ${answer}`);

