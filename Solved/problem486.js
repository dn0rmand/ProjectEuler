const assert = require('assert');
const { TimeLogger, polynomial, linearRecurrence, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 18n;
const P1 = 3 ** 2;
const P2 = /*23; //**/ 1997;
const P3 = /*53; //**/ 4877;

const MODULO = P1 * P2 * P3;

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


  generateIndexes(k, max, cycle1, cycle2, callback) {
    let start = k * this.cycle;
    let didWork = false;
    if (start > Number.MAX_SAFE_INTEGER) {
      start = BigInt(k) * BigInt(this.cycle);
      if (start > max) {
        return true;
      }
      const s1 = Number(start % BigInt(cycle1));
      const s2 = Number(start % BigInt(cycle2));
      for (const idx of this.indexes.values()) {
        const i = start + BigInt(idx);
        if (i > max) {
          break;
        }
        didWork |= callback((s1 + idx) % cycle1, (s2 + idx) % cycle2, idx);
      }
    } else {
      if (start > max) {
        return true;
      }

      const s1 = start % cycle1;
      const s2 = start % cycle2;

      for (const idx of this.indexes.values()) {
        const i = start + idx;
        if (i > max) {
          break;
        }
        didWork |= callback((s1 + idx) % cycle1, (s2 + idx) % cycle2, idx);
      }
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

function DD(L, { offset, cycle1, cycle2, cycle3 }) {
  const tracer = new Tracer(true);
  const max = L > Number.MAX_SAFE_INTEGER ? L - BigInt(offset) : L - offset;

  const indexes1 = [...cycle1.indexes.values()].reduce((a, v) => { a[v] = 1; return a; }, []);
  const indexes2 = [...cycle2.indexes.values()].reduce((a, v) => { a[v] = 1; return a; }, []);
  let indexes3 = [...cycle3.indexes.values()];

  cycle1 = cycle1.cycle;
  cycle2 = cycle2.cycle;

  let total = 0;
  let k1 = 0;

  let gcd = cycle1.gcd(cycle2).gcd(cycle3.cycle);
  let bigStep = (cycle1 / gcd) * (cycle2 / gcd);

  // Find first k

  let start = 0;

  for (let k = 0; ; start += cycle3.cycle, k++) {
    if (start > max) {
      break;
    }

    for (const i3 of indexes3) {
      const idx = start + i3;
      if (idx > max) {
        break;
      }
      const i1 = idx % cycle1;
      const i2 = idx % cycle2;

      if (indexes1[i1] && indexes2[i2]) {
        k1 = k;
        break;
      }
    }

    if (k1) {
      break;
    }
  }

  let done = false;
  for (let k = k1; k - k1 < bigStep; start += cycle3.cycle, k++) {
    tracer.print(_ => bigStep - (k - k1));

    if (start > max) {
      done = true;
      break;
    }

    for (const i3 of indexes3) {
      const idx = start + i3;
      const i1 = idx % cycle1;
      const i2 = idx % cycle2;

      if (indexes1[i1] && indexes2[i2]) {
        if (idx > max) {
          done = true;
          break;
        } else {
          total++;
        }
      }
    }

    if (done) {
      break;
    }
  }

  if (!done) {
    let maxSteps = (BigInt(max) / (BigInt(bigStep) * BigInt(cycle3.cycle)));
    let maxK = BigInt(bigStep) * maxSteps;
    total = total * Number(maxSteps);
    let lastK = Number((BigInt(max) / BigInt(cycle3.cycle)) + 1n);

    for (let k = Number(maxK); ; k++) {
      tracer.print(_ => lastK - k);
      const done = cycle3.generateIndexes(k, max, cycle1, cycle2, (i1, i2, i3) => {
        if (indexes1[i1] && indexes2[i2]) {
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

const D = L => DD(L, context);

// assert.strictEqual(D(1e7), 0);
assert.strictEqual(D(5e9), P2 === 23 ? 448841 : 51);
assert.strictEqual(D(9524776956), 100);
assert.strictEqual(D(18010838498), 200);
assert.strictEqual(D(26168704503), 300);
assert.strictEqual(D(33855231633), 400);
assert.strictEqual(D(33855231632), 399);

console.log('Tests passed');

const answer = TimeLogger.wrap('Solving', _ => D(MAX));
console.log(`Answer is ${answer}`);