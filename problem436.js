const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

function emulate() {
    let current = 0;

    function play(target) {
        let last;
        while (current < target) {
            last = Math.random();
            current += last;
        }
        return last;
    }

    const p1 = play(1);
    const p2 = play(2);
    return p2 > p1;
}

function monteCarlo(steps) {
    let wins = 0;
    const tracer = new Tracer(true);
    for (let i = 0; i < steps; i++) {
        tracer.print((_) => `${steps - i}: ${wins / (i + 1)}`);

        if (emulate()) {
            wins++;
        }
    }
    tracer.clear();
    return (wins / steps).toFixed(10);
}

// console.log(monteCarlo(1e9));

const PRECISION = 1000;
const THRESHOLD = 1e-15;

class State {
    constructor(remaining, probability, p1, p2) {
        this.remaining = remaining;
        this.probability = probability;
        this.p1 = p1 || 0;
        this.p2 = p2 || 0;
    }

    get key() {
        return this.remaining * PRECISION + this.p1;
    }

    get won() {
        return this.remaining < 0 && this.p1 < this.p2;
    }

    get lost() {
        return (this.remaining < 0 && this.p1 >= this.p2) || this.p1 === PRECISION;
    }

    *moves() {
        for (let v = 0; v < PRECISION; v++) {
            const c = this.remaining - v;
            const p1 = this.remaining >= PRECISION && c < PRECISION ? v : this.p1;
            const p2 = c < 0 ? v : this.p2;
            const prob = this.probability / PRECISION;

            yield new State(c, prob, p1, p2);
        }
    }
}

function solve() {
    let newStates = new Map();
    let states = new Map();
    let total = 0;

    const add = (state) => {
        if (state.won) {
            total += state.probability;
        } else if (!state.lost) {
            const k = state.key;
            const o = newStates.get(k);
            if (o) {
                o.probability += state.probability;
            } else if (state.probability > THRESHOLD) {
                newStates.set(k, state);
            }
        }
    };

    states.set(0, new State(2 * PRECISION, 1));

    const tracer = new Tracer(true);
    while (states.size > 0) {
        newStates.clear();
        let size = states.size;
        for (const state of states.values()) {
            for (const newState of state.moves()) {
                tracer.print(() => `${size}: ${newStates.size} - ${total.toFixed(10)}`);
                add(newState);
            }
            size--;
        }
        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    return total;
}

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer.toFixed(10)}`);
