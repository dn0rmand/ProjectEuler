const assert = require('assert');
const Decimal = require('decimal.js');
const { TimeLogger, primeHelper, polynomial } = require('@dn0rmand/project-euler-tools');

const MAX = 142857; // precision = 200000
const MAX_PRIME = 7 * MAX + 5;

const answer = TimeLogger.wrap('', (_) => {
  Decimal.set({ precision: 200000, rounding: 4 });

  // 200 -> precision = 277 - 1.385
  // 300 -> precision = 393 - 1.31
  // 400 -> precision = 552 - 1.38
  // 500 -> precision = 689 - 1.378
  // 600 -> precision = 827 - 1.378333..

  primeHelper.initialize(MAX_PRIME);
  const allPrimes = primeHelper.allPrimes();

  class FactorialValue {
    static clone(primes) {
      return primes.map((p) => p);
    }

    constructor(value) {
      if (typeof value === 'number') {
        if (value === 1) {
          this.primes = [];
        } else {
          throw 'Error';
        }
      } else {
        this.primes = FactorialValue.clone(value);
      }
    }

    toString() {
      let s = [];

      for (let i = 0; i < this.primes.length; i += 2) {
        if (this.primes[i + 1]) {
          s.push(`${this.primes[i]}^${this.primes[i + 1]}`);
        }
      }
      if (s.length === 0) {
        return '1';
      } else {
        return s.join('*');
      }
    }

    get primesMap() {
      return new Map(this.primes);
    }

    addPower(prime, power) {
      let min = 0;
      let max = this.primes.length / 2 - 1;
      while (min <= max) {
        const middle = Math.floor((min + max) / 2);
        const idx = middle * 2;
        const p = this.primes[idx];
        if (p === prime) {
          this.primes[idx + 1] += power;
          if (this.primes[idx + 1] === 0) {
            this.primes.splice(idx, 2);
          }
          return;
        }
        if (p < prime) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }
      const i = Math.max(min, max) * 2;
      if (i >= this.primes.length) {
        if (this.primes.length && prime <= this.primes[this.primes.length - 2]) {
          throw 'Error';
        }
        this.primes.push(prime);
        this.primes.push(power);
      } else {
        debugger;
        this.primes.splice(i, 0, power, prime);
      }
    }

    times(other) {
      const newPrime = new FactorialValue(this.primes);
      for (let i = 0; i < other.primes.length; i += 2) {
        newPrime.addPower(other.primes[i], other.primes[i + 1]);
      }
      return newPrime;
    }

    dividedBy(other) {
      const newPrime = new FactorialValue(this.primes);
      for (let i = 0; i < other.primes.length; i += 2) {
        newPrime.addPower(other.primes[i], -other.primes[i + 1]);
      }
      return newPrime;
    }

    toValue() {
      let value = new Decimal(1);
      for (let i = 0; i < this.primes.length; i += 2) {
        const v = new Decimal(this.primes[i]).pow(this.primes[i + 1]);
        value = value.times(v);
      }
      return value;
    }
  }

  const $numbers = (function () {
    const numbers = [];

    function inner(value, index, primes) {
      if (value > MAX) {
        return;
      }
      numbers[value] = new FactorialValue(primes);

      for (let i = index; i < allPrimes.length; i++) {
        const prime = allPrimes[i];
        let v = value * prime;
        if (v > MAX) {
          break;
        }

        primes.push(prime);
        let idx = primes.length;
        primes.push(1);

        while (v <= MAX) {
          inner(v, i + 1, primes);
          v *= prime;
          primes[idx]++;
        }
        primes.pop();
        primes.pop();
      }
    }

    inner(1, 0, []);

    return numbers;
  })();

  function loadFactorials(m) {
    const factorials = [];

    let current = $numbers[1];
    factorials[0] = current; //.toValue();
    factorials[1] = current; //.toValue();
    let max = m;
    for (let i = 2; i <= max; i++) {
      current = current.times($numbers[i]);
      factorials[i] = current; //.toValue();
    }
    return factorials;
  }

  function toAnswer(value) {
    const y = value.toString();
    const x = y.replace('.', '').split('e+')[0];
    const s = BigInt(x).toString(7);
    const v = s.substring(0, 10);
    return v;
  }

  function bruteG(m) {
    const $factorials = loadFactorials(m);

    let maxF = m;

    function getFactorial(n) {
      if (n <= maxF) {
        return $factorials[n];
      }
      let current = $factorials[maxF];
      for (let i = maxF + 1; i <= n; i++) {
        current = current.times($numbers[i]);
        $factorials[i] = current;
      }
      maxF = n;
      return $factorials[n];
    }

    const M = getFactorial(m);

    let total = new Decimal(0);
    for (let j = 0; j <= m; j++) {
      const j5 = getFactorial(j + 5);
      const divisor = getFactorial(m - j).times(j5);
      let sign = j % 2 ? -1 : 1;
      let up = new Decimal(0);
      let down = new Decimal(0);
      for (let i = 0; i <= j; i++) {
        const a = getFactorial(j + 5 + 6 * i);
        const b = getFactorial(i);
        const c = getFactorial(j - i);
        const d = getFactorial(6 * i);
        const e = b.times(c).times(d);
        const numerator = M.times(a);
        const divisor2 = divisor.times(e);
        const value = numerator.dividedBy(divisor2);

        if (sign === -1) {
          down = down.plus(value.toValue());
        } else {
          up = up.plus(value.toValue());
        }
        sign = -sign;
      }
      const updown = up.minus(down);
      total = total.plus(updown);
    }

    return total;
  }

  function getPolynomial() {
    const values = [];
    let seven = 1n;
    for (let m = 1; m <= 10; m++) {
      seven *= 7n;
      const gValue = bruteG(m);
      const value = BigInt(gValue.valueOf());
      if (value % seven !== 0n) {
        throw 'Error!';
      }
      values.push(value / seven);
    }

    polynomial.thresold = 5;
    return polynomial.findPolynomial(0, 1, (x) => values[x]);
  }

  function getFormula() {
    const polynomial = getPolynomial();

    const coefficients = polynomial.coefficients.map(({ power, n, d }) => ({
      power: Number(power),
      numerator: Number(n),
      divisor: Number(d),
    }));

    const calculate = (m) => {
      const x = new Decimal(m - 1);

      let value = new Decimal(0);

      for (const { power, numerator, divisor } of coefficients) {
        let v = x.pow(power).times(numerator).dividedBy(divisor);
        value = value.plus(v);
      }

      const seven = new Decimal(7).pow(Math.min(10, m)); // answer is base 7 but only 10 highest digits
      return value.times(seven);
    };

    return (m) => {
      const value = calculate(m);
      return toAnswer(value);
    };
  }

  const g = getFormula();

  assert.strictEqual(g(10), (127278262644918).toString(7).substring(0, 10));
  assert.strictEqual(g(200), '1000255016');
  assert.strictEqual(g(300), '1032543425');
  assert.strictEqual(g(400), '4320512002');
  assert.strictEqual(g(500), '1640351503');
  assert.strictEqual(g(600), '4545620010');

  console.log('Tests passed');

  return g(MAX);
});

console.log(`Answer for g(${MAX}) is ${answer}`);
