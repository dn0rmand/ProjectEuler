const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

class State {
  constructor() {
    this.count = 1n;
    this.groups = [];
    this.active = 0;
    this.maxActive = 0;
    this.$key = undefined;
  }

  clone() {
    const state = new State();

    state.count = this.count;
    state.groups = this.groups.slice(0);
    state.active = this.active;
    state.maxActive = this.maxActive;

    return state;
  }

  addCard(card) {
    if (!this.groups[card]) {
      this.groups[card] = 1;
      this.active++;
      this.maxActive = Math.max(this.maxActive, this.active);
    } else {
      if (++this.groups[card] === 4) {
        this.active--;
      }
    }
  }

  get key() {
    if (this.$key === undefined) {
      const groups = this.groups.filter((v) => v).sort((a, b) => a - b);
      const key = `${this.maxActive}:${groups.join('')}`;
      this.$key = key;
    }
    return this.$key;
  }

  next(card) {
    if (this.groups[card] !== 4) {
      const state = this.clone();
      state.addCard(card);
      return state;
    }
  }
}

function E(n, trace) {
  let states = new Map();
  let newStates = new Map();

  states.set(0, new State());

  const cards = 4 * n;
  const tracer = new Tracer(trace);
  for (let i = 0; i < cards; i++) {
    tracer.print((_) => `${cards - i}: ${states.size}`);
    newStates.clear();
    for (const state of states.values()) {
      for (let card = 0; card < n; card++) {
        const newState = state.next(card);
        if (!newState) {
          continue;
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

  let totalStacks = 0n;
  let totalCount = 0n;

  for (const state of states.values()) {
    totalCount += state.count;
    totalStacks += state.count * BigInt(state.maxActive);
  }

  tracer.clear();

  const v = totalStacks.divise(totalCount, 8);
  return v;
}

assert.strictEqual(E(2), 1.97142857);
assert.strictEqual(E(10), 9.41225955);
assert.strictEqual(
  TimeLogger.wrap('', (_) => E(20)),
  18.46623861
);
console.log('Test passed');
const answer = TimeLogger.wrap('', (_) => E(60, true));
console.log(`Answer is ${answer}`);
