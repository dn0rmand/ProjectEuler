import assert from 'assert';
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const x2 = -2;
const x3 = -3;
const x4 = -4;

let factor2: number;
let factor3: number;
let factor4: number;

class zCache {
  //        value       sum         digits
  data: Map<number, Map<number, Set<number>>>;
  x: number;

  constructor(x: number) {
    this.data = new Map();
    this.x = x;
  }

  clear() {
    this.data.clear();
  }

  add(value: number, sum: number, digits: number) {
    let o = this.data.get(value);
    if (o === undefined) {
      o = new Map();
      this.data.set(value, o);
    }

    let s = o.get(sum);
    if (s === undefined) {
      s = new Set();
      o.set(sum, s);
    }

    s.add(digits);
  }

  find34(value: number, sum: number): number {
    const factor = this.x === 3 ? factor3 : factor4;

    if (value % factor !== 0) {
      return 0;
    }

    let total = 0;
    const entry = this.data.get(-value / factor);
    if (entry) {
      for (const [sum2, digits] of entry) {
        if (sum2 !== sum) {
          total += digits.size;
        }
      }
    }
    return total;
  }

  isSolution(value: number, factor: number, x: number, digits: number): boolean {
    while (digits) {
      const d = digits % 10;
      digits = (digits - d) / 10;
      value += factor * d;
      factor *= x;
    }
    return value === 0;
  }

  find2(v2: number, v3: number, v4: number, sum: number): number {
    if (v2 % factor2 !== 0) {
      return 0;
    }

    let total = 0;
    const entry = this.data.get(-v2 / factor2);
    if (entry) {
      for (const [sum2, digits] of entry) {
        if (sum2 !== sum) {
          digits.forEach((dd) => {
            total += this.isSolution(v3, factor3, x3, dd) || this.isSolution(v4, factor4, x4, dd) ? 0 : 1;
          });
        }
      }
    }
    return total;
  }
}

class z1Memoizer {
  data: { even: number | undefined; odd: number | undefined }[][];
  options: Int32Array;

  constructor() {
    this.data = [];
    this.options = new Int32Array(19);

    for (let d1 = 0; d1 < 10; d1++) {
      for (let d2 = 0; d2 < 10; d2++) {
        const diff = d1 - d2;
        this.options[diff + 9]++;
      }
    }
  }

  get(sum: number, remaining: number): number | undefined {
    const a = this.data[remaining];
    if (a) {
      const k = a[Math.abs(sum)];
      if (k) {
        if (sum < 0) {
          return k.odd;
        } else {
          return k.even;
        }
      }
    }
  }

  set(sum: number, remaining: number, value: number): void {
    let a = this.data[remaining];
    if (!a) {
      a = [];
      this.data[remaining] = a;
    }

    let k = a[Math.abs(sum)];
    if (!k) {
      k = { even: undefined, odd: undefined };
      a[Math.abs(sum)] = k;
    }

    if (sum < 0) {
      k.odd = value;
    } else {
      k.even = value;
    }
  }
}

const cache2 = new zCache(2);
const cache3 = new zCache(3);
const cache4 = new zCache(4);

function prepareCache(digits: number, trace: boolean) {
  cache2.clear();
  cache3.clear();
  cache4.clear();

  const left = Math.floor(digits / 2);
  const right = digits - left;

  factor2 = x2 ** right;
  factor3 = x3 ** right;
  factor4 = x4 ** right;

  function add(digits: number) {
    let v2 = 0;
    let v3 = 0;
    let v4 = 0;

    let sum = 0;
    let v = digits;
    let odd = 1;
    let f2 = 1;
    let f3 = 1;
    let f4 = 1;
    while (v) {
      const d = v % 10;
      v = (v - d) / 10;
      sum += odd * d;
      v2 += d * f2;
      v3 += d * f3;
      v4 += d * f4;
      odd = -odd;
      f2 *= x2;
      f3 *= x3;
      f4 *= x4;
    }

    if ((right & 1) === 0) {
      sum = -sum;
    }

    cache2.add(v2, sum, digits);
    cache3.add(v3, sum, digits);
    cache4.add(v4, sum, digits);
  }

  const max = 10 ** left;

  const tracer = new Tracer(trace, 'Preparing cache');
  for (let i = 0; i < max; i++) {
    tracer.print(() => max - i);
    add(i);
  }
  tracer.clear();
}

function Z34(digits: number, x: number): number {
  const cache = x === 3 ? cache3 : cache4;

  x = -x;

  const left = Math.floor(digits / 2);
  const right = digits - left;
  const xFactor = x ** right;

  function part2(factor: number, value: number, power: number, sum: number): number {
    let t = 0;

    if (power < 0) {
      t = cache.find34(value, sum);
    } else {
      const isOdd = power & 1;
      const start = power === 0 ? 1 : 0;
      const f = factor / x;
      for (let d = start; d < 10; d++) {
        t += part2(f, value + f * d, power - 1, sum + (isOdd ? -d : d));
      }
    }
    return t;
  }

  const total = part2(xFactor, 0, right - 1, 0);

  return total;
}

function Z2(digits: number, trace: boolean): number {
  const left = Math.floor(digits / 2);
  const right = digits - left;

  factor2 = x2 ** right;

  function part2(v2: number, v3: number, v4: number, power: number, sum: number): number {
    let t = 0;

    if (power < 0) {
      t = cache2.find2(v2, v3, v4, sum);
    } else {
      const tracer = new Tracer(trace && power > 3);

      const isOdd = power & 1;
      const start = power === 0 ? 1 : 0;
      const f2 = x2 ** power;
      const f3 = x3 ** power;
      const f4 = x4 ** power;
      for (let d = start; d < 10; d++) {
        tracer.print(() => 9 - d);

        t += part2(v2 + f2 * d, v3 + f3 * d, v4 + f4 * d, power - 1, sum + (isOdd ? -d : d));
      }
      tracer.clear();
    }

    return t;
  }

  const total = part2(0, 0, 0, right - 1, 0);

  return total;
}

function Z56789(digits: number, x: number): number {
  const allowedDigits = [0, 1];
  for (let d = x; d <= 9; d++) {
    allowedDigits.push(d);
  }

  x = -x;

  function inner(value: number, power: number, sum: number): number {
    if (power === 0) {
      if (value < 0 && value > -10 && sum !== value) {
        return 1;
      }
      return 0;
    }

    const isOdd = power & 1;

    let total = 0;
    for (const d of allowedDigits) {
      total += inner(value + x ** power * d, power - 1, sum + (isOdd ? -d : d));
    }
    return total;
  }

  const total = inner(0, digits - 1, 0);

  return total;
}

function Z1(digits: number): number {
  const $z1 = new z1Memoizer();

  function inner(sum: number, remaining: number): number {
    if (remaining === 0) {
      return sum === 0 ? 1 : 0;
    } else if (remaining === 1) {
      return sum >= 0 && sum <= 9 ? 1 : 0;
    } else {
      const cached = $z1.get(sum, remaining);
      if (cached !== undefined) {
        return cached;
      }
      let total = 0;
      for (let diff = -9; diff <= 9; diff++) {
        const count = $z1.options[diff + 9];
        total += count * inner(sum + diff, remaining - 2);
      }
      $z1.set(sum, remaining, total);
      return total;
    }
  }

  const total = inner(0, digits) - inner(0, digits - 1);
  return total;
}

function Z(n: number, trace = false): number {
  const digits = n.toString().length - 1;

  prepareCache(digits, trace);

  const _0 = 10 ** (digits - 1);
  const _1 = Z1(digits);
  const _5678 = Z56789(digits, 8) * 4;
  const _9 = Z56789(digits, 9);

  const _3 = Z34(digits, 3);
  const _4 = Z34(digits, 4);
  const _2 = Z2(digits, trace);

  const total = _0 + _1 + _2 + _3 + _4 + _5678 + _9;

  return total;
}

assert.strictEqual(Z(100_000), 14696);
assert.strictEqual(Z(1_000_000), 152960);
assert.strictEqual(Z(1e8), 14435778);

console.log('Tests passed');

const answer = TimeLogger.wrap('1e16', () => Z(1e16, true));
console.log(`Answer is ${answer}`);
