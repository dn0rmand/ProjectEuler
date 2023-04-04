const assert = require('assert');
const fs = require('fs');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1234567;
const MAXI = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER)) + 1;

class Total {
  constructor(value) {
    this.total = 0;
    this.extra = BigInt(value || 0);
  }

  add(value) {
    if (value instanceof Total) {
      value = value.value;
    }

    if (typeof (value) === 'bigint') {
      this.extra += value;
    } else {
      const t = this.total + value;
      if (t > Number.MAX_SAFE_INTEGER) {
        this.extra += BigInt(this.total);
        this.total = value;
      } else {
        this.total = t;
      }
    }
  }

  get value() {
    if (this.extra) {
      const v = BigInt(this.total) + this.extra;
      if (v <= Number.MAX_SAFE_INTEGER) {
        return Number(v);
      } else {
        return v;
      }
    } else {
      return this.total;
    }
  }
}

let n, n2, m1Div, m2Div;

function init(N, start) {
  n = N;
  n2 = n + n;
  [m1Div, m2Div] = start === 3 ? [2, 1] : [1, 2];
}

function sequence(m) {
  const modulo = m + n;
  const m1 = (m + 1) / m1Div;
  let m2 = (n2 + m) / m2Div;
  if (m2 > modulo) {
    m2 %= modulo;
  }
  if (m1 >= MAXI || m2 >= MAXI) {
    const m1m2 = BigInt(m1) * BigInt(m2) % BigInt(modulo);
    return Number(m1m2);
  } else {
    return (m1 * m2) % modulo;
  }
}

function processT(seq2, seq1, m) {
  const k = seq2 - seq1 - 2;

  if (k < -1) {
    return m + 2;
  }
  if (k > 0) {
    const jump = 2 * Math.floor((m + n - seq2) / k);
    return m + (jump < 2 ? 2 : jump);
  }
  return -1;
}

function T(n, total) {
  const max = n * n;

  total = total || new Total();

  for (const start of [3, 4]) {
    init(n, start);

    for (let m = start; m <= max;) {
      const seq2 = sequence(m);

      if (seq2 === 0) {
        total.add(m);
        m += 2;
      } else {
        const seq1 = sequence(m - 2);
        m = processT(seq2, seq1, m);
        if (m < 0) {
          break;
        }
      }
    }
  }

  return total;
}

function U(N, trace) {
  let total = new Total();

  const tracer = new Tracer(trace);

  let start = N;

  // const fileName = './problem834.data';
  // if (trace && fs.existsSync(fileName)) {
  //   const data = JSON.parse(fs.readFileSync(fileName));
  //   start = data.n;
  //   total = new Total(data.total);
  // }

  for (let n = start; n >= 3; n--) {
    tracer.print(_ => {
      // const data = JSON.stringify({
      //   n, total: total.value.toString()
      // }, null, 4);
      // fs.writeFileSync(fileName, data);
      return n;
    });

    T(n, total);
  }
  tracer.clear();

  return total.value;
}

assert.strictEqual(T(10).value, 148);
assert.strictEqual(T(100).value, 21828);
assert.strictEqual(U(100), 612572);
assert.strictEqual(U(1000), 656827957);

console.log('Tests passed');
console.log(TimeLogger.wrap('', _ => U(12345, true)));

// const answer = TimeLogger.wrap('', _ => U(MAX, true));
// console.log(`Answer is ${answer} `);
