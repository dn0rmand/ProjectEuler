const assert = require('assert');
const { TimeLogger, Tracer, chineseRemainder } = require('@dn0rmand/project-euler-tools');

let ZERO = 0;
let ONE = 1;
let TWO = 2;

const TEST_PRIME = 19;

class Context {
  static $factorials = {};
  static $modInv = {};

  constructor(n, prime, trace) {
    const isBig = typeof n === 'bigint';

    this.convert = isBig ? (v) => BigInt(v) : (v) => v;
    this.unconvert = isBig ? (v) => Number(v) : (v) => v;

    ZERO = this.convert(0);
    ONE = this.convert(1);
    TWO = this.convert(2);

    this.nString = Number(n).toExponential();
    this.trace = trace;
    this.tracer = new Tracer(trace, `Seeding ${prime} - ${this.nString}`);

    this.even = n % TWO === ZERO;
    this.middle = n / TWO;
    this.last = this.even ? this.middle - ONE : this.middle;
    this.n = n;
    this.b = 1;
    this.top = 0;
    this.total = 0;
    this.prime = prime;
    this.modulo = prime ** 3;
    this.powers = new Uint32Array(this.modulo);
    this.direction1 =
      this.convert(this.prime) -
      ((((this.n + ONE) % this.convert(this.modulo)) + ONE) % this.convert(this.prime));
    this.direction2 = this.n % this.convert(this.prime);
    this.jumps = {};
    this.jumps[3] = this.direction1;

    const power = this.unconvert(this.n % this.convert((prime - 1) * prime * prime));

    this.factorials = Context.$factorials[prime];
    this.modInv = Context.$modInv[prime];

    const sameFactorials = this.factorials !== undefined;
    const sameModInv = this.modInv !== undefined;

    if (!sameModInv) {
      this.modInv = new Uint32Array(this.modulo);
      Context.$modInv[prime] = this.modInv;
    }
    if (!sameFactorials) {
      this.factorials = new Uint32Array(this.modulo);
      Context.$factorials[prime] = this.factorials;
    }

    this.factorials[0] = 1;

    for (let i = 1; i < this.modulo; i++) {
      this.tracer.print((_) => this.modulo - i);
      if (!sameModInv) {
        if (i % this.prime === 0) {
          this.modInv[i] = -1;
        } else {
          this.modInv[i] = i.modInv(this.modulo);
        }
      }
      if (!sameFactorials) {
        let v = i;
        while (v % this.prime === 0) {
          v /= this.prime;
        }
        this.factorials[i] = v.modMul(this.factorials[i - 1], this.modulo);
      }
      this.powers[i] = i.modPow(power, this.modulo);
    }

    this.tracer.clear();
  }

  print(k) {
    this.tracer.print((_) => this.middle - k);
  }

  getPower(value) {
    value = this.toNumber(value);
    return this.powers[value];
  }

  getFactorial(value) {
    value = this.toNumber(value);
    const nk = (this.toNumber(this.n) + this.modulo - value) % this.modulo;
    const v1 = this.factorials[nk];
    const v2 = this.factorials[value];
    return this.modMul(v1, v2);
  }

  updateBinomial(start, end) {
    const numerator = this.getFactorial(start);
    const divisor = this.getFactorial(end);
    const extra = this.modDiv(numerator, divisor);

    this.b = this.modMul(this.b, extra);
  }

  toNumber(v) {
    if (typeof v === 'bigint') {
      return this.unconvert(v % this.convert(this.modulo));
    } else {
      return v % this.modulo;
    }
  }

  modMul(v1, v2) {
    v1 = this.toNumber(v1);
    v2 = this.toNumber(v2);
    return v1.modMul(v2, this.modulo);
  }

  modDiv(v1, v2) {
    v1 = this.toNumber(v1);
    v2 = this.toNumber(v2);
    v2 = this.modInv[v2 % this.modulo];
    return v1.modMul(v2, this.modulo);
  }

  modAdd(v1, v2) {
    v1 = this.toNumber(v1);
    v2 = this.toNumber(v2);
    return (v1 + v2) % this.modulo;
  }

  update(k) {
    let numerator = this.n - k;
    let divisor = k + ONE;
    let prime = this.convert(this.prime);

    while (numerator % prime === ZERO) {
      numerator /= prime;
      this.top++;
    }

    while (divisor % prime === ZERO) {
      divisor /= prime;
      this.top--;
    }

    this.b = this.modMul(this.b, numerator);
    this.b = this.modDiv(this.b, divisor);
  }

  getCount(k) {
    let c = 0;
    let value = this.n - k;
    let prime = this.convert(this.prime);
    while (value % prime === ZERO) {
      c++;
      value /= prime;
    }
    value = k + ONE;
    while (value % prime === ZERO) {
      c--;
      value /= prime;
    }
    return c;
  }

  jump(k) {
    if (this.top < 3 || k > this.last) {
      return k;
    }

    const start = k;
    let pos = k;

    if (this.top === 3) {
      pos += this.direction1;
    } else if (this.jumps[this.top] !== undefined) {
      pos += this.jumps[this.top];
    } else {
      let direction = this.direction1;
      let newTop = this.top;
      while (pos <= this.last) {
        pos += direction;
        let c = this.getCount(pos);
        if (newTop + c < 3) {
          break;
        }
        newTop += c;
        pos++;
        direction = direction === this.direction1 ? this.direction2 : this.direction1;
      }
      if (pos > this.last) {
        return pos;
      }
      this.jumps[this.top] = pos - k;
    }

    k = pos;
    this.updateBinomial(start, k);
    this.update(k);
    return k + ONE;
  }

  step(k) {
    if (this.top >= 3 || k > this.last) {
      return k;
    }
    let top = this.top;
    let amount = 0;

    while (k <= this.last && this.top === top) {
      const p = this.prime.modPow(this.top, this.modulo);
      const b2 = this.modMul(this.b, p);
      const a = this.modAdd(this.getPower(k), this.getPower(this.n - k));
      const value = this.modMul(b2, a);
      amount = this.modAdd(amount, value);
      this.update(k);
      k++;
    }
    this.total = this.modAdd(this.total, amount);
    return k;
  }

  execute() {
    this.tracer = new Tracer(this.trace, `Execute ${this.prime} - ${this.nString}`);
    let k = ZERO;

    while (k <= this.last) {
      this.print(k);
      k = this.step(k);
      k = this.jump(k);
    }

    if (this.even && k === this.middle) {
      const p = this.prime.modPow(this.top, this.modulo);
      const b2 = this.modMul(this.b, p);
      const a = this.getPower(this.middle);
      this.total = this.modAdd(this.total, this.modMul(b2, a));
    }

    this.tracer.clear();
    return BigInt(this.total);
  }
}

function smallS(n, prime, trace) {
  const context = new Context(n, prime, trace !== false);

  return context.execute();
}

function S(n, trace) {
  //   n = BigInt(n);

  trace = trace !== false;

  const s1 = smallS(n, 83, trace);
  const s2 = smallS(n, 89, trace);
  const s3 = smallS(n, 97, trace);

  const s12 = chineseRemainder(83n ** 3n, 89n ** 3n, s1, s2);
  const result = chineseRemainder(83n ** 3n * 89n ** 3n, 97n ** 3n, s12, s3);

  return result;
}

// assert.strictEqual(S(10, false), 142469423360n);
// assert.strictEqual(S(10000, false), 44930979938863017n);
// assert.strictEqual(S(100000, false), 363005245175792116n);

// assert.strictEqual(
//   TimeLogger.wrap(`1e5 ${TEST_PRIME}`, (_) => smallS(10n ** 5n, TEST_PRIME)),
//   410n
// );

assert.strictEqual(
  TimeLogger.wrap(`1e7, ${TEST_PRIME}`, (_) => smallS(1e7, TEST_PRIME)),
  2841n
);

// console.log('Test passed');

// console.log(TimeLogger.wrap('', (_) => smallS(1e8, TEST_PRIME)));
// console.log(TimeLogger.wrap('S(1e8)', (_) => S(1e8, true)));

const answer = S(10n ** 18n);
console.log(`Answer is ${answer}`);
