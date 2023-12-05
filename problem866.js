const assert = require('assert');
const { TimeLogger } = require("@dn0rmand/project-euler-tools");

const MODULO = 987654319

/*
123

1 (1) => 1, 3 (1)(3)=> 1, 2 (1-3) => 3 * 5 = 15 => 1 * 1 * 15
3 (3) => 1, 1 (1)(3)=> 1, 2 (1-3) => 3 * 5 = 15 => 1 * 1 * 15

1 (1) => 1, 2 (1-2) => 2 * 3 = 6, 3 (1-3) => 3 * 5 = 15 => 1 * 6 * 15
2 (2) => 1, 3 (2-3) => 2 * 3 = 6, 1 (1-3) => 3 * 5 = 15 => 1 * 6 * 15
2 (2) => 1, 1 (1-2) => 2 * 3 = 6, 3 (1-3) => 3 * 5 = 15 => 1 * 6 * 15
3 (3) => 1, 2 (2-3) => 2 * 3 = 6, 1 (1-3) => 3 * 5 = 15 => 1 * 6 * 15

expected = 65
*/

class State {
  constructor(segments, product, count) {
    this.segments = segments || [];
    this.product = product || 1;
    this.count = count || 1;
  }

  get key() {
    if (this.segments.length === 0) { return 'x'; }

    const offset = this.segments[0].start;
    const newSegments = this.segments.map(({ start, end }) => ({ start: start - offset, end: end - offset }));
    const subKey = newSegments.reduce((a, s, i) => {
      if (i) {
        const s0 = this.segments[i - 1];
        a.push(s.start - s0.end + 1);
      }
      a.push(s.end - s.start + 1);
      return a;
    }, [offset]).join('-');

    return `${this.product}:${subKey}`
  }

  createState(newSegments, i) {
    if (i && newSegments[i - 1].end + 1 === newSegments[i].start) {
      newSegments[i].start = newSegments[i - 1].start;
      newSegments.splice(i - 1, 1);
    } else if (i + 1 < newSegments.length && newSegments[i].end + 1 == newSegments[i + 1].start) {
      newSegments[i].end = newSegments[i + 1].end;
      newSegments.splice(i + 1, 1);
    }

    const k = newSegments[i].end - newSegments[i].start + 1;

    return new State(newSegments, this.product * (k * (2 * k - 1)), this.count);
  }

  addPiece(piece) {
    for (let i = 0; i < this.segments.length; i++) {
      const { start, end } = this.segments[i];
      if (piece >= start && piece <= end) {
        return;
      }
      const newSegments = [...this.segments];
      if (start === piece + 1) {
        newSegments[i] = { start: piece, end };
        return this.createState(newSegments, i);
      } else if (end + 1 === piece) {
        newSegments[i] = { start, end: piece };
        return this.createState(newSegments, i);
      }
    }

    const newSegments = [...this.segments, { start: piece, end: piece }];
    newSegments.sort((a, b) => a.start - b.start);
    return new State(newSegments, this.product, this.count);
  }
};

function solve(N) {
  let states = new Map();
  let newStates = new Map();

  states.set(1, new State([], 1, 1));

  for (let i = 0; i < N; i++) {
    newStates.clear();
    for (const state of states.values()) {
      for (let piece = 1; piece <= N; piece++) {
        const newState = state.addPiece(piece);
        if (!newState) { continue; }
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
  let ways = 0;
  for (const state of states.values()) {
    total += state.count * state.product;
    ways += state.count;
  }

  total /= ways;
  return total;
}

console.log(solve(3));

assert.strictEqual(solve(4), 994);
console.log('Test passed');

const answer = solve(100)
console.log(`Answer is ${answer}`);
