const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

class State {
  constructor(stacks, previous, probability) {
    // stacks[i] = number of stacks with i cards of the same rank

    // if (stacks.length) {
    //   stacks[0] = 0; // We don't care about empty stacks 
    // }
    this.previous = previous;
    this.stacks = stacks;
    this.probability = probability;
    this.$key = undefined;
  }

  get key() {
    if (!this.$key) {
      this.$key = `${this.previous}:${this.stacks.join(',')}`;
    }
    return this.$key;
  }

  *play(remainingCards) {
    let prob, newState;
    for (let i = 4; i > 0; i--) {
      if (!this.stacks[i]) {
        continue;
      }
      if (this.previous === i) {
        // It's a match!
        prob = i / remainingCards;
        newState = new State([], 0, prob * this.probability);
        yield newState;
        // Not a match
        if (this.stacks[i] > 1) {
          prob = (i * (this.stacks[i] - 1)) / remainingCards;
          const newStacks = [...this.stacks];
          newStacks[i]--;
          newStacks[i - 1]++;
          newState = new State(newStacks, i - 1, prob * this.probability);
          yield newState;
        }
      } else {
        prob = (this.stacks[i] * i) / remainingCards;
        const newStacks = [...this.stacks];
        newStacks[i]--;
        newStacks[i - 1]++;
        newState = new State(newStacks, i - 1, prob * this.probability);
        yield newState;
      }
    }
  }
}

function solve(suits, trace) {
  let states = new Map();
  let newStates = new Map();

  states.set(0, new State([0, 0, 0, 0, suits], 0, 1, 1));

  let answer = 0;
  const totalCards = 4 * suits;

  const tracer = new Tracer(trace);
  for (let cards = totalCards, turns = 1; cards; turns++, cards--) {
    tracer.print(_ => `${cards}: ${states.size}`);
    newStates.clear();
    for (const state of states.values()) {
      for (const newState of state.play(cards)) {
        if (!newState.stacks.length) {
          answer += turns * newState.probability;
        } else {
          const key = newState.key;
          const old = newStates.get(key);
          if (old) {
            old.probability += newState.probability;
          } else {
            newStates.set(key, newState);
          }
        }
      }
    }
    [states, newStates] = [newStates, states];
  }

  for (const s of states.values()) {
    answer += totalCards * s.probability;
  }
  tracer.clear();
  return answer.toFixed(8);
}

const answer = TimeLogger.wrap('', _ => solve(13, true));
console.log(`Answer is ${answer}`);
