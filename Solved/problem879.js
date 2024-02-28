const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const masks = (function () {
  const masks = [0];

  let v = 1;
  for (let i = 1; i < 20; i++, v *= 2) {
    masks[i] = v;
  }
  return masks;
})();

const getIntermediates = size => {
  const memoize = [];

  return (a, b) => {
    if (a > b) {
      [a, b] = [b, a];
    }
    const k = a * 20 + b;
    let result = memoize[k];
    if (result !== undefined) {
      return result;
    }
    result = [];
    memoize[k] = result;

    a--;
    b--;

    let [x1, y1] = [a % size, (a - (a % size)) / size];
    let [x2, y2] = [b % size, (b - (b % size)) / size];

    if (x2 === x1) {
      for (let y = y1 + 1; y < y2; y++) {
        result.push((x1 + size * y) + 1);
      }
      return result;
    }

    if (y1 === y2) {
      for (let x = x1 + 1; x < x2; x++) {
        result.push((x + size * y1) + 1);
      }
      return result;
    }

    a = (y2 - y1) / (x2 - x1);

    if (Math.floor(a) !== a) {
      return result;
    }

    b = (x2 * y1 - x1 * y2) / (x2 - x1);

    if (x1 > x2) {
      [x1, x2, y1, y2] = [x2, x1, y2, y1];
    }

    for (let x = x1 + 1; x < x2; x++) {
      const y = a * x + b;
      if (y === Math.floor(y)) {
        result.push((x + size * y) + 1);
      }
    }

    return result;
  };
};

class State {
  constructor(current, used, count) {
    this.count = count;
    this.used = used | masks[current];
    this.current = current;
    this.key = 100 * this.used + current;
  }

  canMoveTo(to, intermediate) {
    if (this.used & masks[to]) {
      return false;
    }

    for (const i of intermediate(this.current, to)) {
      if ((this.used & masks[i]) === 0) {
        return false;
      }
    }

    return true;
  }
}

function count(width) {
  const intermediate = getIntermediates(width);

  let states = new Map();
  let newStates = new Map();

  maxKey = width ** 2;

  for (let key = 1; key <= maxKey; key++) {
    const s = new State(key, 0, 1);
    states.set(s.key, s);
  }

  let total = 0;

  for (let used = 2; used <= maxKey; used++) {
    newStates.clear();

    for (const state of states.values()) {
      for (let digit = 1; digit <= maxKey; digit++) {
        if (state.canMoveTo(digit, intermediate)) {
          const newState = new State(digit, state.used, state.count);
          const old = newStates.get(newState.key);

          total += newState.count;

          if (old) {
            old.count += newState.count;
          } else {
            newStates.set(newState.key, newState);
          }
        }
      }
    }
    [states, newStates] = [newStates, states];
  }

  return total;
}

assert.strictEqual(count(3), 389488);
console.log('Test passed');

const answer = TimeLogger.wrap('', _ => count(4));
console.log(`Answer is ${answer}`);
