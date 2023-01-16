const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const THIRD = 1 / 3;
const NINETH = 1 / 9;
const TWO_THIRD = 2 / 3;
const TWO_NINETH = 2 / 9;

function moves({ distance, probability }) {
  const nineth = probability * NINETH;
  const two_nineth = 2 * nineth;

  if (distance > 3) {
    return [
      { distance, probability: probability * THIRD },
      { distance: distance + 1, probability: two_nineth },
      { distance: distance + 2, probability: nineth },
      { distance: distance - 1, probability: two_nineth },
      { distance: distance - 2, probability: nineth },
    ];
  } else if (distance === 3) {
    return [
      { distance: 0, probability: probability * THIRD },
      { distance, probability: two_nineth },
      { distance: distance + 1, probability: two_nineth },
      { distance: distance + 2, probability: nineth },
      { distance: distance - 1, probability: nineth },
    ];
  } else if (distance === 2) {
    return [
      { distance: 0, probability: probability * TWO_THIRD },
      { distance, probability: nineth },
      { distance: distance + 1, probability: nineth },
      { distance: distance + 2, probability: nineth },
    ];
  } else {
    return [{ distance: 0, probability }];
  }
}

const PRECISION = 1e-15;

function SS(n) {
  const MAX = 2 * n;

  let states = new Map();
  let newStates = new Map();

  let a = 0;

  states.set(n, { distance: n, probability: 1 });
  while (states.size > 0) {
    newStates.clear();
    for (const state of states.values()) {
      for (const newState of moves(state)) {
        if (newState.distance <= 0) {
          a += newState.probability;
        } else if (newState.distance >= MAX) {
          a -= newState.probability;
        } else if (newState.probability > PRECISION) {
          const key = newState.distance;
          const o = newStates.get(key);
          if (o) {
            o.probability += newState.probability;
          } else {
            newStates.set(key, newState);
          }
        }
      }
    }
    [states, newStates] = [newStates, states];
  }

  return Math.abs(a);
}

function S(n) {
  return SS(n).toFixed(8);
}

function T(N, trace) {
  let total = 0;
  const tracer = new Tracer(trace);
  let s;
  for (let n = 2; n <= N; n++) {
    tracer.print((_) => N - n);
    s = SS(n);
    total += s;
  }
  tracer.clear();
  return total.toFixed(8);
}

// console.log(S(2));
assert.strictEqual(T(10), '2.38235282');
console.log('Tests passed');
const answer = TimeLogger.wrap('', (_) => T(50, true));
console.log(`Answer is ${answer}`);
