const assert = require('assert');

class NumberCollection {
  constructor(numbers) {
    this.numbers = numbers ? new Map(numbers) : new Map();
  }

  clone() {
    return new NumberCollection(this.numbers);
  }

  add(number, count) {
    if (number < 1) {
      return;
    }
    let newCount = (this.numbers.get(number) || 0) + count;
    this.numbers.set(number, newCount);
  }

  remove(number) {
    let count = this.numbers.get(number);
    if (count === undefined) {
      return;
    }
    if (count <= 1) {
      this.numbers.delete(number);
    } else {
      this.numbers.set(number, count - 1);
    }
  }

  keys() {
    return this.numbers.keys();
  }

  get size() {
    return this.numbers.size;
  }

  getUniqueId() {
    const keys = [...this.numbers.keys()].sort((a, b) => a - b);
    const values = [];
    for (const key of keys) {
      const v = this.numbers.get(key);
      values.push(`${key}:${v}`);
    }
    return values.join('-');
  }
}

class State {
  constructor(numbers, skipped) {
    this.numbers = numbers;
    this.skipped = skipped;
    this.$key = undefined;
  }

  get key() {
    if (this.$key === undefined) {
      this.$key = this.numbers.getUniqueId();
    }
    return this.$key;
  }

  clone() {
    return new State(this.numbers.clone(), this.skipped);
  }

  *drOne() {
    for (const key of this.numbers.keys()) {
      const bits = key.toString(2);
      for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
          const newBits = "0" + bits.substring(0, i) + bits.substring(i + 1);
          const newValue = parseInt(newBits, 2);
          const state = this.clone();
          state.numbers.remove(key);
          state.numbers.add(newValue, 1);
          yield state;
          break;
        }
      }
    }
  }

  *drZero() {
    let didPlay = false;
    for (const key of this.numbers.keys()) {
      const bits = key.toString(2);
      for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
          const newBits = "0" + bits.substring(0, i) + bits.substring(i + 1);
          const newValue = parseInt(newBits, 2);
          const state = this.clone();
          state.numbers.remove(key);
          state.numbers.add(newValue, 1);
          didPlay = true;
          yield state;
          break;
        }
      }
    }
    if (!didPlay) {
      yield new State(this.numbers, this.skipped + 1);
    }
  }
}

function createStartState(n) {
  const numbers = new NumberCollection();

  for (let v = 1; v <= n; v++) {
    numbers.add(v, v);
  }

  return new State(numbers, 0);
}

function S(n) {
  let states = new Map();
  let newStates = new Map();
  let interimStates = new Map();
  let minSkipped = Number.MAX_SAFE_INTEGER;

  states.set(0, createStartState(n));

  while (states.size > 0) {
    newStates.clear();
    interimStates.clear();

    for (const state of states.values()) {
      if (state.skipped >= minSkipped) {
        continue;
      }

      let canPlay = false;
      for (const newState of state.drOne()) {
        canPlay = true;
        const k = newState.key;
        const old = interimStates.get(k);
        if (!old) {
          interimStates.set(k, newState);
        }
      }

      if (!canPlay) {
        minSkipped = Math.min(minSkipped, state.skipped);
      }
    }

    for (const state of interimStates.values()) {
      for (const newState of state.drZero()) {
        const k = newState.key;
        const old = newStates.get(k);
        if (!old || old.skipped > newState.skipped) {
          newStates.set(k, newState);
        }
      }
    }

    [states, newStates] = [newStates, states];
  }

  return minSkipped;
}

assert.strictEqual(S(5), 17);
assert.strictEqual(S(10), 64);
assert.strictEqual(S(2), 2);

console.log('Tests Passed');

console.log([S(2), S(3), S(4), S(5), S(6), S(7), S(8), S(9)].join(', '));

