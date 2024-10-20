const assert = require('assert');
const { Tracer, BigSet } = require('@dn0rmand/project-euler-tools');

const TARGET = 'NOWPICKBELFRYMATHS';

const A = 'A'.charCodeAt(0);

function swap(array, i1, i2) {
  const c = array[i1];
  array[i1] = array[i2];
  array[i2] = c;
}

function makeKey(value) {
  return value.reduce((a, v) => a * 18n + BigInt(v.charCodeAt(0) - A), 0n);
}

function move(value, start, visited, base) {
  for (let i = start.length - 1; i >= 0; i--) {
    const idx = value.indexOf(start[i]);
    if (idx > 0) {
      swap(value, idx, idx - 1);
      const key = makeKey(value)
      if (!visited.has(key)) {
        visited.add(key);
        return value;
      }
      swap(value, idx, idx - 1);
    }

    if (idx + 1 < value.length) {
      swap(value, idx, idx + 1);
      const key = makeKey(value);
      if (!visited.has(key)) {
        visited.add(key);
        return value;
      }
      swap(value, idx, idx + 1);
    }
  }
}

function solve(target, trace) {
  const start = target.split('').sort();

  const left = [];
  const right = [];
  for (let i = start.length - 1; i > 0; i -= 2) {
    right.unshift(start[i]);
    left.push(start[i - 1]);
  }
  const t2 = makeKey([...left, ...right]);

  target = makeKey(target.split(''));

  const visited = new BigSet();
  visited.add(makeKey(start));

  let steps = 0;

  const tracer = new Tracer(trace);

  let state = [...start];

  let WY = false;
  let WYST = false;
  while (!visited.has(target)) {
    if (trace) {
      if (state[0] === 'W' && state[state.length - 1] === 'Y') {
        tracer.print(_ => state.join(''));
      }
      if (visited.has(t2)) {
        debugger;
      }
      // if (!WY && state[0] === 'W' && state[state.length - 1] === 'Y') {
      //   console.log(state.join(''), '=>', steps);
      //   WY = true;
      // }
      // if (!WYST && state[0] === 'W' && state[1] === 'S' && state[state.length - 2] === 'T' && state[state.length - 1] === 'Y') {
      //   console.log(state.join(''), '=>', steps);
      //   // WYST = true;
      // }
    }
    steps++;
    state = move(state, start, visited);
  }
  tracer.clear();
  return steps;
}

assert.strictEqual(solve('BELFRY'), 59);

console.log('Test passed');

const answer = solve('NOWPICKBELFRYMATHS', true);
console.log(`Answer is ${answer}`);