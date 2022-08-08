const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const validNumbers = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, /*16,*/ 18, 20, 21, 24, /*27,*/ 28, 30, /*32,*/ 35, 36, 39, 40,
  42, 45 /* 48,*/, 52, /*54,*/ 56, 60, 63, /*64,*/ /* 65,*/ 70, 72 /* 80,*/,
].reduce((a, v) => {
  a.add(v);
  return a;
}, new Set());

const magic = (function () {
  let m = 1;

  for (let v = 2; v <= 80; v++) {
    if (validNumbers.has(v)) {
      m = m.lcm(v * v);
    }
  }

  if (m > Number.MAX_SAFE_INTEGER) {
    throw 'Value too big';
  }
  return m;
})();

const target = magic / 2;

class State {
  constructor(sum, minUsed, count) {
    this.sum = sum;
    this.minUsed = minUsed;
    this.count = count;
    this.key = `${sum}:${minUsed}`;
  }

  *next(min, max) {
    for (let number = Math.max(min, this.minUsed + 1); number <= max; number++) {
      if (!validNumbers.has(number)) {
        continue;
      }
      const value = magic / (number * number);
      if (value !== Math.floor(value)) {
        throw 'ERROR';
      }
      const sum = this.sum + value;
      if (sum <= target) {
        const newState = new State(sum, number, this.count);

        yield newState;
      }
    }
  }
}

function calculate(min, max) {
  const startState = new State(0, 1, 1);

  let values = new Map();
  let states = new Map();
  let newStates = new Map();

  states.set(0, startState);

  while (states.size > 0) {
    newStates.clear();

    for (const state of states.values()) {
      for (const newState of state.next(min, max)) {
        const k = newState.sum;
        const o = values.get(k);
        if (o) {
          o.count += newState.count;
        } else {
          values.set(k, { sum: newState.sum, count: newState.count });
        }

        const old = newStates.get(newState.key);
        if (old) {
          old.count += newState.count;
        } else {
          newStates.set(newState.key, newState);
        }
      }
    }

    [states, newStates] = [newStates, states];
  }

  return values;
}

function solve(max) {
  const offset = 25;

  let left = calculate(2, offset);
  let right = calculate(offset + 1, max);

  if (right.size < left.size) {
    // Switch them to iterate the smallest one
    [left, right] = [right, left];
  }

  let result = 0;

  for (const { sum, count } of left.values()) {
    const reminder = target - sum;
    if (reminder === 0) {
      result += count;
    } else {
      const other = right.get(reminder);
      if (other) {
        result += count * other.count;
      }
    }
  }
  return result;
}

assert.strictEqual(solve(45), 3);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(80));
console.log(`Answer is ${answer}`);
