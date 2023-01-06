const assert = require('assert');
const sleep = require('atomic-sleep');
const { Tracer, TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');
const MAX = 1e4;
const MAX_M = 1e16;
const MODULO = 1234567891;
const MODULO_N = 1234567891n;

primeHelper.initialize(MAX);

const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

function reduce(value) {
  for (let prime of allPrimes) {
    if (prime > value) {
      throw 'WHAT HAPPENED!!!';
    }
    if (value % prime === 0n) {
      value /= prime;
      return { prime, value };
    }
  }
}

const stdout = process.stdout;

function dump(values, clear) {
  function asString(p) {
    let s = p.toString();
    while (s.length < 4) {
      s = ' ' + s;
    }
    return s + ' ';
  }

  let rows = [];
  for (let v of values) {
    let row = [];
    rows.push(row);
    for (let p of allPrimes) {
      if (p > v) {
        throw 'error';
      }
      while (v % p === 0n) {
        row.push(p);
        v /= p;
      }
      if (v === 1n) {
        break;
      }
    }
  }

  if (clear !== false) {
    stdout.write('\u001Bc');
  }
  for (let row of rows) {
    for (let p of row) {
      stdout.write(asString(p));
    }
    stdout.write(`\r\n`);
  }
}

function isTriangle(values) {
  let previous = 0;
  for (let v of values) {
    let count = 0;
    for (let p of allPrimes) {
      if (p > v) {
        throw 'error';
      }
      while (v % p === 0n) {
        v /= p;
        count++;
      }
      if (v === 1n) {
        break;
      }
    }
    if (count < previous || count > previous + 2) {
      return false;
    }
    previous = count;
  }
  return true;
}

function cycleLength(diagonal) {
  for (let i = 1; i < diagonal.length; i++) {
    if (diagonal[i - 1] !== diagonal[i]) {
      return BigInt(diagonal.length);
    }
  }
  return 1n;
}

function updateDiagonals(diagonals, steps) {
  for (const diagonal of diagonals) {
    const cycle = cycleLength(diagonal);
    if (cycle === 1n) {
      continue;
    }
    let remaining = steps % cycle;
    while (remaining--) {
      diagonal.push(diagonal.shift());
    }
  }
}

function diagonalsToValues(diagonals) {
  const values = [];
  for (let i = 1; i <= diagonals[0].length; i++) {
    let v = 1n;
    for (const d of diagonals) {
      const idx = d.length - i;
      if (idx >= 0) {
        v *= d[idx];
      }
    }
    if (v > 1n) {
      values.push(v);
    }
  }
  values.reverse();
  return values;
}

function valuesToDiagonals(values) {
  const rows = [];
  for (let v of values) {
    const row = [];
    for (let p of allPrimes) {
      while (v % p === 0n) {
        row.push(p);
        v /= p;
      }
      if (v === 1n) {
        break;
      }
    }
    rows.push(row);
  }

  const diagonals = [];
  for (let i = 0; i < rows.length; i++) {
    let d = [];
    let y = i;
    let x = 0;
    while (y < rows.length) {
      d.push(rows[y][x] || 1n);
      x++;
      y++;
    }
    diagonals.push(d);
  }
  return diagonals;
}

function doProcess(values) {
  let newValue = 1n;
  for (let i = 0; i < values.length; i++) {
    const { prime, value } = reduce(values[i]);
    values[i] = value;
    newValue *= prime;
  }
  values.push(newValue);
  values = values.filter((v) => v !== 1n);
  return values;
}

function S(n, m, expected, trace) {
  const expectedSteps = expected ** 2;
  m = BigInt(m);

  let values = [];
  for (let i = 2; i <= n; i++) {
    values.push(BigInt(i));
  }
  const tracer = new Tracer(trace, `Looping for ${n}`);
  let gotTriangle = false;
  let step = 1n;
  for (; step <= m; step++) {
    tracer.print((_) => `${m - step}: ${values.length}`);
    values = doProcess(values);
    if (step > expectedSteps && values.length === expected) {
      if (isTriangle(values)) {
        gotTriangle = true;
        break;
      }
    }
  }

  if (gotTriangle) {
    const diagonals = valuesToDiagonals(values);
    updateDiagonals(diagonals, m - step);
    values = diagonalsToValues(diagonals);
  }

  tracer.clear();
  const answer = Number(values.reduce((a, v) => (a + v) % MODULO_N, 0n));
  return answer;
}

assert.strictEqual(S(100, 1e8, 22, true), 105957327);

assert.strictEqual(S(5, 3, 10), 21);
assert.strictEqual(S(10, 100, 6), 257);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(MAX, MAX_M, 253, true));
console.log(`Answer is ${answer}`);
