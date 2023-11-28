const assert = require('assert');

class State {
  constructor(digits, count) {
    this.digits = digits || [];
    this.count = count || 1;
  }

  get key() {
    return +(this.digits.join(''));
  }

  get valid() {
    let d = [...this.digits];
    while (d.length >= 3) {
      if (d[0] === 0 && d[1] === 0 && d[2] === 0) {
        d = d.slice(3);
      } else {
        return !!d[0];
      }
    }
    return false;
  }

  *next() {
    for (let d = 0; d < 10; d++) {
      if (this.digits.length) {
        yield new State([d, d, d, ...this.digits], this.count);
        yield new State([...this.digits, d, d, d], this.count);
        yield new State([d, ...this.digits, d, d], this.count);
        yield new State([d, d, ...this.digits, d], this.count);
      } else {
        yield new State([d, d, d], this.count);
      }
    }
  }
}

function T0(digits) {
  let states = new Map();
  let newStates = new Map();
  states.set(0, new State());

  for (let i = 0; i < digits; i += 3) {
    newStates.clear();
    for (const state of states.values()) {
      for (const newState of state.next()) {
        const k = newState.key;
        const o = newStates.get(k);
        if (o) {
          o.count += newState.count;
        } else {
          newStates.set(k, newState);
        }
      }
    }
    [states, newStates] = [newStates, states];
  }

  let total = 0;
  for (const s of states.values()) {
    if (s.valid) {
      total++;
    }
  }
  return total;
}

function T1(digits) {
  function inner(remaining, digits) {
    if (remaining === 0) {
      return 1;
    }
    // x-xx or xx-x
    let total = 2 * digits * inner(remaining - 3, 10);
    // x-x-x
    for (let left = 3; remaining - 3 - left > 0; left += 3) {
      total += digits * inner(left, 10) * inner(remaining - 3 - left, 10);
    }
    return total;
  }

  const t = inner(digits, 9);
  return t;
}

function T(N) {
  const memoize = new Map();

  function remap(digits) {
    let next = 0;
    const m = [];
    const get = d => {
      if (m[d]) {
        return m[d];
      } else {
        m[d] = ++next;
        return next;
      }
    }
    const newDigits = [...digits];
    for (let i = newDigits.length - 1; i >= 0; i--) {
      newDigits[i] = get(newDigits[i]);
    }
    return newDigits;
  }

  function inner(digits, remaining) {
    if (remaining === 0) {
      return digits.length === 0 ? 1 : 0;
    }
    const key = `${remaining}:${remap(digits).join('')}`;
    let total = memoize.get(key);
    if (total !== undefined) {
      return total;
    }
    total = digits.length === 0 ? 1 : 0;
    for (let d = 0; d < 10; d++) {
      const newDigits = (digits[0] === d && digits[1] === d) ? digits.slice(2) : [d, ...digits];
      total += inner(newDigits, remaining - 1);
    }

    memoize.set(key, total);
    return total;
  }

  let total = 0;
  for (let d = 1; d < 10; d++) {
    total += inner([d], N - 1);
  }

  return total;
}

let values = [];
for (let i = 1; i < 5; i++) {
  values.push(T(3 * i));
}
console.log(values.join(', '));
assert.strictEqual(T(6), 261);

console.log('Tests passed');