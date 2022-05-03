const assert = require('assert');
const {
    Tracer,
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

const RANKS = 13;
const SUITS = 4;
const DECKS = 10;
const JOKERS = 2;

const MAX_RANK = RANKS + JOKERS;

class Card {
    constructor(deck, suit, rank, key) {
        this.deck = deck;
        this.suit = suit;
        this.rank = rank;
        this.key = key;
    }

    get joker() {
        return this.rank >= RANKS;
    }
}

const ALL_CARDS = (function () {
    const cards = [];

    let key = 0;
    for (let deck = 0; deck < DECKS; deck++) {
        for (let suit = 0; suit < SUITS; suit++) {
            for (let rank = 0; rank < RANKS; rank++) {
                cards.push(new Card(deck, suit, rank, key++));
            }
        }
        // Add Jokers
        for (let rank = RANKS; rank < MAX_RANK; rank++) {
            cards.push(new Card(deck, 0, rank, key++));
        }
    }

    return cards;
})();

class State {
    constructor(visited, cards, probability) {
        this.visited = visited;
        this.cards = cards;
        this.probability = probability;
        this.$info = undefined;
    }

    get info() {
        if (this.$info === undefined) {
            let $ranks = new Uint8Array(RANKS);
            let $suits = new Uint8Array(SUITS);
            let $decks = new Uint8Array(DECKS);
            let ranks = 0;
            let suits = 0;
            let decks = 0;

            const set = (ar, v) => {
                if (ar[v] !== 1) {
                    ar[v] = 1;
                    return 1;
                } else {
                    return 0;
                }
            };

            for (const visited of this.visited) {
                decks += set($decks, visited.deck);
                if (!visited.joker) {
                    ranks += set($ranks, visited.rank);
                    suits += set($suits, visited.suit);
                }
            }

            this.$info = {
                decks,
                suits,
                ranks
            };
            return this.$info;
        } else {
            return this.$info;
        }
    }

    get done() {
        return this.info.decks === DECKS && this.info.suits === SUITS && this.info.ranks === RANKS;
    }

    getKey() {
        const key = ((this.info.decks * 100 + this.info.suits) * 100 + this.info.ranks);
        return key;
    }

    add(card, probability) {
        if (!this.cards[card.key]) {
            const cards = Uint8Array.from(this.cards);
            const visited = [...this.visited, card];
            cards[card.key] = 1;
            const newState = new State(visited, cards, probability * this.probability);
            return newState;
        }
    }
}

function solve(trace) {
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State([], new Uint8Array(ALL_CARDS.length), 1));

    let sum = 0;
    const tracer = new Tracer(trace);

    for (let turn = 1, remaining = ALL_CARDS.length; remaining > 0; remaining--, turn++) {
        if (states.size === 0) {
            break;
        }
        newStates.clear();
        let size = states.size;
        const prob = 1 / remaining;
        for (const state of states.values()) {
            tracer.print(_ => `${remaining}: ${size} - ${newStates.size}`);
            size--;
            for (let card of ALL_CARDS) {
                const newState = state.add(card, prob);
                if (!newState) {
                    continue;
                }
                if (newState.done) {
                    newState.done;
                    sum += turn * newState.probability;
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
    assert.strictEqual(states.size, 0);
    return sum.toFixed(8);
}

const answer = TimeLogger.wrap('', _ => solve(true));
console.log(`Answer is ${answer}`);