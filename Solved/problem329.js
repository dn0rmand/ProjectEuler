const {
    TimeLogger,
    PreciseNumber,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const POSITIONS = 500;
const HALF = PreciseNumber.create(1, 2);

primeHelper.initialize(POSITIONS);

const CROAK_MAP = {
    T: {
        P: PreciseNumber.create(2, 3),
        N: PreciseNumber.create(1, 3)
    },
    F: {
        P: PreciseNumber.create(1, 3),
        N: PreciseNumber.create(2, 3)
    }
};

class State {
    constructor(position, probability) {
        this.probability = probability;
        this.position = position;
    }

    * next(expected) {
        const isPrime = primeHelper.isKnownPrime(this.position) ? 'T' : 'F';
        const prop = CROAK_MAP[isPrime][expected];

        let newProp = this.probability.times(prop);
        if (this.position < POSITIONS && this.position > 1) {
            newProp = newProp.times(HALF);
            yield new State(this.position + 1, newProp);
            yield new State(this.position - 1, newProp);
        } else if (this.position === 1) {
            yield new State(2, newProp)
        } else if (this.position === POSITIONS) {
            yield new State(POSITIONS - 1, newProp)
        } else {
            throw "ERROR";
        }
    }
}

function solve() {
    const expected = 'PPPPNNPPPNPPNPN';

    let states = new Map();
    let newStates = new Map();

    const startProb = PreciseNumber.create(1, POSITIONS);
    for (let p = 1; p <= POSITIONS; p++) {
        states.set(p, new State(p, startProb));
    }

    for (const expect of expected) {
        newStates.clear();
        for (const state of states.values()) {
            for (const newState of state.next(expect)) {
                const k = newState.position;
                const o = newStates.get(k);
                if (o) {
                    o.probability = o.probability.plus(newState.probability);
                } else {
                    newStates.set(k, newState);
                }
            }
        }

        [newStates, states] = [states, newStates];
    }

    let answer = PreciseNumber.Zero;

    for (const state of states.values()) {
        answer = answer.plus(state.probability);
    }

    return answer;
}

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer.toString()}`);