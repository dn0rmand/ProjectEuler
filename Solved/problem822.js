const assert = require('assert');
const { Tracer, TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e4;
const MAX_M = 1e16;
const MODULO = 1234567891;

primeHelper.initialize(MAX);

class Value {
  constructor(v) {
    this.primes = [];
    this.primeLogs = [];
    this.factors = [];
    this.squareCount = 0;
    primeHelper.factorize(v, (p, f) => {
      this.primes.push(p);
      this.factors.push(f);
      this.primeLogs.push(Math.log10(p));
    });
  }

  square() {
    this.squareCount++;
    this.factors = this.factors.map((f) => f.modMul(2, MODULO - 1));
  }

  getValue() {
    const v = this.primes.reduce((a, p, i) => {
      const v = p.modPow(this.factors[i], MODULO);
      return a.modMul(v, MODULO);
    }, 1);
    return v;
  }

  logValue() {
    return this.primeLogs.reduce((a, p, i) => a + p * this.factors[i], 0);
  }

  compare(other) {
    return this.logValue() - other.logValue();
  }
}

function process(values) {
  values[0].square();
  values.sort((a, b) => a.compare(b));
}

let $times = undefined;
let $primeTime = [];

function primeTime(p, times) {
  if (times !== $times) {
    $times = times;
    $primeTime = [];
  }

  if ($primeTime[p]) {
    return $primeTime[p];
  }

  const power = Number(4).modPow(times, MODULO - 1);
  const result = p.modPow(power, MODULO);
  $primeTime[p] = result;
  return result;
}

function S(n, m, trace) {
  const values = [];
  for (let i = 2; i <= n; i++) {
    values.push(new Value(i));
  }

  let last = values[values.length - 1];
  let s;
  let c = 1;
  let times;

  let tracer = new Tracer(trace, 'Calculating');
  m = BigInt(m);
  for (let step = 1n; step <= m; step++) {
    tracer.print((_) => m - step);
    process(values);
    if (last.squareCount === c) {
      if (c === 1) {
        // first so ignore
        c += 2;
        s = step;
      } else {
        // Now it's the good one
        const repeat = step - s;
        times = (m - step) / repeat;
        step += times * repeat;
        times = Number(times);
        c = 0;
      }
    }
  }
  tracer.clear();

  if (times) {
    tracer = new Tracer(trace, 'Updating');
    for (let i = 0; i < values.length; i++) {
      tracer.print((_) => values.length - i);
      const value = values[i];
      for (let k = 0; k < value.primes.length; k++) {
        value.primes[k] = primeTime(value.primes[k], times);
      }
    }
    tracer.clear();
  }

  tracer = new Tracer(trace, 'Reducing');
  const answer = values.reduce((a, v, i) => {
    tracer.print((_) => values.length - i);
    return (a + v.getValue()) % MODULO;
  }, 0);
  tracer.clear();
  return answer;
}

assert.strictEqual(S(5, 3), 34);
assert.strictEqual(S(10, 100), 845339386);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(MAX, MAX_M, true));
console.log(`Answer is ${answer}`);
