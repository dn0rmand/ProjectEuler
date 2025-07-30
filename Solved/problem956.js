const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1000;
const MODULO = 999_999_001;

primeHelper.initialize(MAX);

class FactorizedNumber {
  static ONE = new FactorizedNumber();

  constructor(primes) {
    this.primes = primes ? new Map(primes) : new Map();
  }

  addPrime(prime, power) {
    this.primes.set(prime, power + (this.primes.get(prime) ?? 0));
  }

  times(value) {
    const newValue = new FactorizedNumber(this.primes);

    if (value instanceof FactorizedNumber) {
      for (const [prime, power] of value.primes) {
        newValue.addPrime(prime, power);
      }
    } else {
      primeHelper.factorize(value, (prime, power) => {
        newValue.addPrime(prime, power);
      });
    }

    return newValue;
  }

  valueOf() {
    let v = 1;

    for (const [prime, power] of this.primes) {
      v = v.modMul(prime.modPow(power, MODULO), MODULO);
    }

    return v;
  }
}

const $factorials = [FactorizedNumber.ONE];

function factorial(n) {
  if (n < 2) {
    return $factorials[0];
  }

  if ($factorials[n] !== undefined) {
    return $factorials[n];
  }

  const value = factorial(n - 1).times(n);

  $factorials[n] = value;

  return value;
}

const $superFactorials = [FactorizedNumber.ONE];

function superFactorial(n) {
  if (n < 2) {
    return $superFactorials[0];
  }

  if ($superFactorials[n] !== undefined) {
    return $superFactorials[n];
  }

  const value = factorial(n).times(superFactorial(n - 1));
  $superFactorials[n] = value;

  return value;
}

function superDuperFactorial(n) {
  let value = FactorizedNumber.ONE;
  const tracer = new Tracer(n >= 100, 'SuperDuperFactorial');
  for (let i = 2; i <= n; i++) {
    tracer.print(() => n - i);
    value = value.times(superFactorial(i));
  }
  tracer.clear();

  return value;
}

function D(n, m) {
  const primes = [
    ...FactorizedNumber.ONE.times(n)
      .primes.entries()
      .map(([prime, power]) => ({ prime, power })),
  ].sort((a, b) => a.prime - b.prime);

  function generatePrimeInfo() {
    const primeInfo = [];
    const tracer = new Tracer(m >= 100, 'Building Info');
    for (let i = 0; i < primes.length; i++) {
      const { prime, power } = primes[i];
      const data = new Uint32Array(m);
      primeInfo[i] = data;
      let value = 1;
      let skipped = false;
      for (let p = 0; p <= power; p++) {
        tracer.print(() => `${primes.length - i} - ${power - p}`);
        const t = p % m;
        data[t] = (data[t] + value) % MODULO;
        value = (value * prime) % MODULO;
        if (!skipped && value === 1) {
          skipped = true;
          const ref = new Uint32Array(data);
          p++;
          const offset = p;
          while (p + offset < power) {
            tracer.print(() => `${primes.length - i} - ${power - p}`);
            for (let j = 0; j < m; j++) {
              const k = (p + j) % m;
              data[k] = (data[k] + ref[j]) % MODULO;
            }
            p += offset;
            if (p % m === 0) {
              // Big Steps now
              const times = Math.floor(power / p);
              for (let k = 0; k < m; k++) {
                data[k] = data[k].modMul(times, MODULO);
              }
              p *= times;
            }
          }
          p--; // ++ in for
        }
      }
    }
    tracer.clear();
    return primeInfo;
  }

  const primeInfo = generatePrimeInfo();

  const $inner = [];

  function inner(index, teta) {
    if (index >= primeInfo.length) {
      return teta === 0 ? 1 : 0;
    }

    $inner[index] ??= [];
    let sum = $inner[index][teta];
    if (sum !== undefined) {
      return sum;
    }

    sum = 0;

    for (let t = 0; t < m; t++) {
      const v = primeInfo[index][t];
      const s = inner(index + 1, (teta + t) % m);
      if (s) {
        sum = (sum + s.modMul(v, MODULO)) % MODULO;
      }
    }

    $inner[index][teta] = sum;
    return sum;
  }

  const tracer = new Tracer(m >= 100, 'Preload');

  for (let i = primeInfo.length; i; i--) {
    tracer.print(() => i);
    for (let t = 0; t < m; t++) {
      inner(i - 1, t);
    }
  }
  tracer.clear();

  const total = inner(0, 0);

  return total;
}

function solve(N) {
  return D(superDuperFactorial(N), N);
}

assert.strictEqual(D(24, 3), 21);
assert.strictEqual(solve(6), 6368195719791280 % MODULO);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX));
console.log(`Answer is ${answer}`);
