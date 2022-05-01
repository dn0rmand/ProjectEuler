const assert = require('assert');
const {
    Tracer,
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

const RANKS = 13;
const JOKERS = 2;
const SUITS = 4;
const DECK_SIZE = 54;

class State {
    constructor(jokers, cards, probability) {
        this.jokers = jokers;
        this.cards = cards;
        this.probability = probability;
    }

    get done() {
        return !this.cards.some(v => v === 0);
    }

    getKey() {
        const c = this.cards
            .filter(c => c)
            .sort((a, b) => a - b)
            .map(c => c - 1)
            .join('');
        const cards = c ? parseInt(c, 4) : 0;

        const key = cards * 10 + this.jokers;
        return key;
    }

    add(rank, turn) {
        const totalCards = DECK_SIZE - turn;

        if (rank >= RANKS) {
            if (this.jokers < JOKERS) {
                const remaining = JOKERS - this.jokers;
                const probability = remaining / totalCards;
                const newState = new State(this.jokers + 1, this.cards, this.probability * probability);
                return newState;
            }
        } else if (this.cards[rank] < SUITS) {
            const remaining = SUITS - this.cards[rank];
            const probability = remaining / totalCards;
            const newState = new State(this.jokers, Uint8Array.from(this.cards), this.probability * probability);

            newState.cards[rank] += 1; // dealt
            return newState;
        }
    }
}

function solve(trace) {
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State(0, new Uint8Array(RANKS), 1));

    let sum = 0;
    let totalProb = 0;
    const tracer = new Tracer(trace);

    for (let turn = 0; turn < DECK_SIZE; turn++) {
        if (states.size === 0) {
            break;
        }
        newStates.clear();
        let size = states.size;
        let probability = 0;
        for (const state of states.values()) {
            probability += state.probability;
            tracer.print(_ => `${turn}: ${size} - ${newStates.size}`);
            size--;
            for (let rank = 0; rank <= RANKS; rank++) {
                const newState = state.add(rank, turn);
                if (!newState) {
                    continue;
                }
                if (newState.done) {
                    sum += (turn + 1) * newState.probability;
                    totalProb += newState.probability;
                } else {
                    const key = newState.getKey();
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
    tracer.clear();
    console.log(totalProb);
    assert.strictEqual(states.size, 0);
    return sum.toFixed(8);
}

assert.strictEqual(TimeLogger.wrap('', _ => solve(true)), '29.05361725');

console.log('Test Passed');