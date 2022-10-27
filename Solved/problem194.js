const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1e8;
const KEY_FACTOR = 2000;

class GraphState {
  constructor() {}

  clone() {
    const state = new GraphState();

    state.colors = [...this.colors];
    state.current = this.current;
    state.count = this.count;
    state.type = this.type;

    return state;
  }

  static start(type, limited) {
    const state = new GraphState();

    state.colors = [];
    state.current = 0;
    state.count = 1;
    state.type = type;

    if (limited) {
      state.colors[1] = 1;
      state.colors[2] = 2;
      state.current = 2;
    }
    return state;
  }

  mapColors() {
    const map = [];
    let next = 0;
    const colors = this.colors.slice(1).map((c) => {
      if (!map[c]) {
        map[c] = ++next;
      }
      return map[c];
    });

    return colors;
  }

  get key() {
    const colors = this.mapColors();
    return colors.join(',');
  }

  get left() {
    const colors = this.mapColors();
    return `${colors[0]}-${colors[2]}`;
  }

  get right() {
    const colors = this.mapColors();
    return `${colors[1]}-${colors[2]}`;
  }

  canSetColor(point, color) {
    switch (point) {
      case 1:
        return true;
      case 2:
        return this.colors[1] !== color;
      case 3:
        return this.colors[2] !== color;
      case 4:
        if (this.type === 'A') {
          return this.colors[3] !== color && this.colors[1] !== color;
        } else {
          return this.colors[3] !== color;
        }
      case 5:
        return this.colors[2] !== color && this.colors[3] !== color;
      case 6:
        return this.colors[5] !== color;
      case 7:
        return this.colors[6] !== color && this.colors[1] !== color && this.colors[4] !== color;
      default:
        throw 'Error;';
    }
  }

  next(color) {
    if (this.canSetColor(this.current + 1, color)) {
      const newState = this.clone();
      newState.current = this.current + 1;
      newState.colors[newState.current] = color;
      return newState;
    }
  }

  dump() {
    const [_, A, B, C, D, E, F, G] = this.colors;
    const x = ' ';
    console.log('');
    console.log(`------- ${this.type}: ${this.count} -------`);
    console.log(`${B}${x}${C}`);
    console.log(`${x}${E}${x}`);
    console.log(`${x}${F}${x}`);
    console.log(`${x}${G}${x}`);
    console.log(`${A}${x}${D}`);
  }
}

class PatternState {
  constructor(aCount, bCount, count) {
    this.aCount = aCount;
    this.bCount = bCount;
    this.count = count;
  }

  get complete() {
    return this.aCount === 0 && this.bCount === 0;
  }

  get key() {
    return `${this.aCount}-${this.bCount}`;
  }

  add(count, a, b) {
    if (this.aCount >= a && this.bCount >= b) {
      const newCount = this.count.modMul(count, MODULO);
      const state = new PatternState(this.aCount - a, this.bCount - b, newCount);
      return state;
    }
  }
}

function count(type, colors, limited) {
  const start = GraphState.start(type, limited);

  let newStates = new Map();
  let states = new Map();

  states.set(0, start);

  for (let p = limited ? 3 : 1; p <= 7; p++) {
    newStates.clear();
    for (const state of states.values()) {
      for (let color = 1; color <= colors; color++) {
        const newState = state.next(color);
        if (!newState) {
          continue;
        }
        const key = newState.key;
        const old = newStates.get(key);
        if (old) {
          old.count = (old.count + newState.count) % MODULO;
        } else {
          newStates.set(key, newState);
        }
      }
    }
    [states, newStates] = [newStates, states];
  }

  let total = 0;
  for (const state of states.values()) {
    total = (total + state.count) % MODULO;
  }
  return total;
}

function N(a, b, colors) {
  const minA = count('A', colors, true);
  const minB = count('B', colors, true);

  let states = new Map();
  let newStates = new Map();

  states.set(1, new PatternState(a, b, 1));

  const add = (newState) => {
    if (newState) {
      const k = newState.key;
      const old = newStates.get(k);
      if (old) {
        old.count = (old.count + newState.count) % MODULO;
      } else {
        newStates.set(k, newState);
      }
    }
  };

  let total = 0;

  while (states.size > 0) {
    newStates.clear();
    for (const state of states.values()) {
      if (state.complete) {
        total = (total + state.count) % MODULO;
      } else {
        add(state.add(minA, 1, 0));
        add(state.add(minB, 0, 1));
      }
    }
    [states, newStates] = [newStates, states];
  }

  return total.modMul(colors * (colors - 1), MODULO);
}

assert.strictEqual(count('A', 3), 24);
assert.strictEqual(count('A', 4), 744);
assert.strictEqual(count('A', 5), 7440);

assert.strictEqual(count('B', 3), 36);
assert.strictEqual(count('B', 4), 1056);
assert.strictEqual(count('B', 5), 9720);

assert.strictEqual(N(0, 2, 4), 92928);
assert.strictEqual(N(2, 2, 3), 20736);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => N(25, 75, 1984));
console.log(`Answer is ${answer}`);
