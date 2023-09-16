const assert = require('assert');
const { TimeLogger, BigMap, linearRecurrence, Tracer, chineseRemainder, BigSet } = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 18n;
const P1 = 3 ** 2;
const P2 = 23; //**/ 1997;
const P3 = 53; //**/ 4877;
const MODULO = P1 * P2 * P3;
const MODULO_N = BigInt(MODULO);
const P1_N = BigInt(P1);
const P2_N = BigInt(P2);

function calculateRecurrence() {
  const palindromes = (function () {
    let palindromes = {};

    function inner(left, right) {
      if (left.length > 5) {
        return;
      }
      const p = left + right;
      const p0 = left + '0' + right;
      const p1 = left + '1' + right;

      palindromes[p] = 1;
      palindromes[p0] = 1;
      palindromes[p1] = 1;
      inner('0' + left, right + '0');
      inner('1' + left, right + '1');
    }

    inner('00', '00');
    inner('01', '10');
    inner('10', '01');
    inner('11', '11');
    palindromes = Object.keys(palindromes).filter(s => s.length >= 5);
    return palindromes;
  })();

  function F_5(n) {
    if (n < 5) {
      return 0;
    }

    let total = 0;
    for (let i = 0; i < 2 ** n; i++) {
      let v = i.toString(2);
      while (v.length < n) {
        v = '0' + v;
      }
      let valid = false;
      for (const p of palindromes) {
        if (v.indexOf(p) >= 0) {
          valid = true;
          break;
        }
      }
      if (valid) {
        total++;
      }
    }
    return total;
  }

  let values = [];
  let previous = 0;
  for (let i = 5; i < 21; i++) {
    previous += F_5(i);
    values.push(previous);
  }
  const ln = linearRecurrence(values, true);
  assert.strictEqual(ln.divisor, 1n);
  const fct = new Int32Array(ln.factors.map(v => Number(v)));
  const vls = new Uint32Array(values.slice(0, ln.factors.length));
  return { factors: fct, values: vls };
}

const createNext = (factors, values) => {
  const MODULO_OFFSET = 20 * MODULO;
  return _ => {
    const value = factors.reduce((a, v, i) => a + v * values[i], MODULO_OFFSET);

    values.copyWithin(0, 1);
    values[values.length - 1] = value % MODULO;
  };
};

class Cycles {
  constructor(values, modulo) {
    this.cycle = 0;
    this.values = values.map(v => v % modulo);
    this.indexes = new Set();
    this.modulo = modulo;
  }

  process(index, newValues) {
    if (this.done) {
      return;
    }

    if (newValues[0] % this.modulo === 0) {
      this.indexes.add(index);
    }

    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] !== newValues[i] % this.modulo) {
        return;
      }
    }
    this.cycle = index;
  }

  isValidIndex(i) {
    return this.indexes.has(i % this.cycle);
  }

  generateIndexes(k, max, callback) {
    let start = k * this.cycle;
    let didWork = false;
    if (start > Number.MAX_SAFE_INTEGER) {
      start = BigInt(k) * BigInt(this.cycle);

      this.indexes.forEach(idx => {
        const i = start + BigInt(idx);
        if (i <= max) {
          didWork |= callback(Number(i % P1_N), Number(i % P2_N), idx);
        }
      });
    } else {
      this.indexes.forEach(idx => {
        const i = start + idx;
        if (i <= max) {
          didWork |= callback(i % P1, i % P2, idx);
        }
      });
    }
    return !didWork;
  }

  get done() { return !!this.cycle; }

  get value() {
    return {
      cycle: this.cycle,
      indexes: this.indexes
    };
  }
}

function Prepare() {
  const { factors, values } = calculateRecurrence();
  const next = createNext(factors, values);

  let offset = 5;
  while (values[0] < P3) {
    next();
    offset++;
  }

  function getCycles(values, expected) {
    const cycle1 = new Cycles(values, P1);
    const cycle2 = new Cycles(values, P2);
    const cycle3 = new Cycles(values, P3);

    const tracer = new Tracer(true, `Calculating Cycles`);

    let index = 0;

    while (!cycle1.done || !cycle2.done || !cycle3.done) {
      next();
      index++;
      cycle1.process(index, values);
      cycle2.process(index, values);
      cycle3.process(index, values);
      tracer.print(_ => expected - index);
    }
    tracer.clear();
    return { cycle1, cycle2, cycle3 };
  }

  const { cycle1, cycle2, cycle3 } = getCycles(values, 71340756); // 71340756 is the cycle of cycle3. Use it to trace progress 

  return { offset, cycle1, cycle2, cycle3 };
}

function D(L, { offset, cycle1, cycle2, cycle3 }) {
  const tracer = new Tracer(true);
  const max = L > Number.MAX_SAFE_INTEGER ? L - BigInt(offset) : L - offset;

  let total = 0;
  let set1;
  let k1 = 0;

  let bigStep = 0n;

  // [cycle2, cycle3] = [cycle3, cycle2];
  let gcd = cycle1.cycle.gcd(cycle2.cycle).gcd(cycle3.cycle);
  let big = (cycle1.cycle / gcd) * (cycle2.cycle / gcd);

  for (let k = 0; ; k++) {
    tracer.print(_ => big - (k - k1));

    if ((k - k1) > big) {
      debugger;
    }
    const done = cycle3.generateIndexes(k, max, (i1, i2, i3) => {
      if (bigStep) {
        return false;
      }
      if (cycle1.isValidIndex(i1) && cycle2.isValidIndex(i2)) {
        if (!set1) {
          set1 = [i1, i2, i3];
          k1 = k;
        } else if (
          set1[2] === i3 &&
          set1[0] === i1 &&
          set1[1] === i2) {
          bigStep = k - k1;
          return false;
        }
        total++;
      }
      return true;
    });

    if (done || bigStep) {
      break;
    }
  }
  if (bigStep) {
    let maxSteps = (BigInt(max) / (BigInt(bigStep) * BigInt(cycle3.cycle)));
    let maxK = BigInt(bigStep) * maxSteps;
    total = total * Number(maxSteps);

    for (let k = Number(maxK); ; k++) {
      const done = cycle3.generateIndexes(k, max, (i1, i2, i3) => {
        tracer.print(_ => BigInt(max) - BigInt(idx));
        if (cycle1.isValidIndex(i1) && cycle2.isValidIndex(i2)) {
          total++;
        }
        return true;
      });
      if (done) {
        break;
      }
    }
  }
  tracer.clear();
  return total;
}

// assert.strictEqual(F_5(4), 0);
// assert.strictEqual(F_5(5), 8);
// assert.strictEqual(F_5(6), 42);
// assert.strictEqual(F_5(11), 3844);

const context = TimeLogger.wrap('Pre-Calculation', _ => Prepare());

// assert.strictEqual(D(1e7, context), 0);
assert.strictEqual(D(5e9, context), P2 === 23 ? 448841 : 51);

console.log('Tests passed');

const answer = TimeLogger.wrap('Solving', _ => D(MAX, context));
console.log(`Answer is ${answer}`);