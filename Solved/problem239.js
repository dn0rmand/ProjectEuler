const {
    primeHelper,
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const MAX = 100;
primeHelper.initialize(MAX);

const allPrimes = primeHelper.allPrimes();
const maxInPosition = MAX === 100 ? allPrimes.length - 22 : 3;

class State {
    constructor(remaining, probability, inPosition) {
        this.probability = probability;
        this.remaining = remaining;
        this.inPosition = inPosition;
    }

    getKey(_index) {
        return `${this.inPosition}-${this.remaining.join(':')}`;
    }

    * next(index) {
        const totalRemaining = MAX - index + 1;

        // Use one of the remaining primes
        for (const prime of this.remaining) {
            const remaining = this.remaining.filter(p => p !== prime && p > index);
            const prob = 1 / totalRemaining;

            if (prime === index) {
                yield new State(remaining, this.probability * prob, this.inPosition + 1);
            } else {
                yield new State(remaining, this.probability * prob, this.inPosition);
            }
        }
        // Use something else
        const other = totalRemaining - this.remaining.length;
        if (other === 0) {
            return;
        }

        const prob = other / totalRemaining;

        yield new State(this.remaining.filter(p => p > index), this.probability * prob, this.inPosition);
    }
}

function solve() {
    const startState = new State(allPrimes, 1, 0);

    let states = new Map();
    let newStates = new Map();

    states.set(startState.key, startState);

    const tracer = new Tracer(true);

    for (let index = 1; index < MAX; index++) {
        newStates.clear();

        let size = states.size;
        for (const state of states.values()) {
            tracer.print(_ => `${index}: ${size} - ${newStates.size}`);
            size--;

            for (const newState of state.next(index)) {
                if (newState.inPosition > maxInPosition) {
                    continue; // trash it
                }
                const key = newState.getKey(index);
                const old = newStates.get(key);
                if (old) {
                    old.probability += newState.probability;
                } else {
                    newStates.set(key, newState);
                }
            }
        }
        [states, newStates] = [newStates, states];
    }
    tracer.clear();

    let prob = 0;
    states.forEach(state => {
        if (state.inPosition === maxInPosition) {
            prob += state.probability;
        }
    });

    return prob;
}

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer.toFixed(12)}`);