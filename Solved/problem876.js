const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools')
function f(a, b, c) {
  let states = new Map();
  let newStates = new Map();
  let visited = new Set();

  const normalize = (a, b, c) => {
    let s = 0;
    if (a < 0) s++;
    if (b < 0) s++;
    if (c < 0) s++;
    if (s >= 2) {
      a = -a;
      b = -b;
      c = -c;
    }
    return [a, b, c].sort((a, b) => a - b);
  }

  const add = ({ a, b, c }) => {
    [a, b, c] = normalize(a, b, c);
    const k = `${a},${b},${c}`;
    if (visited.has(k)) {
      return;
    }
    newStates.set(k, { a, b, c });
    visited.add(k);
  };

  add({ a, b, c });
  [states, newStates] = [newStates, states];

  for (let steps = 1; states.size > 0; steps++) {
    newStates.clear();

    for (const { a, b, c } of states.values()) {
      if (steps > 4 && (c < 0 || a > 0)) {
        continue;
      }
      const s1 = { b, c, a: b + b + c + c - a };
      const s2 = { a, c, b: c + c + a + a - b };
      const s3 = { a, b, c: a + a + b + b - c };

      if (s1.a === 0 || s2.b === 0 || s3.c === 0) {
        return steps;
      }
      add(s1);
      add(s2);
      add(s3);
    }

    [states, newStates] = [newStates, states];
  }

  return 0;
}

function F(a, b, trace) {
  let total = 0;

  const values = [];
  let max = a * b + a + b + 1;

  const tracer = new Tracer(trace);
  let previous = 0
  for (let c = 1; c <= max; c++) {
    tracer.print(_ => max - c);
    const v = f(a, b, c);
    if (v) {
      values.push(c - previous);
      previous = c;
    }
    total += v;
  }
  tracer.clear();
  return total;
}

assert.strictEqual(f(6, 10, 35), 3);
assert.strictEqual(f(6, 10, 36), 0);
assert.strictEqual(F(6, 10), 17);
assert.strictEqual(TimeLogger.wrap('', _ => F(36, 100, true)), 179);
console.log('Tests passed');