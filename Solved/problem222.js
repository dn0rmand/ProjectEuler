const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

class State {
    static MIN_RADIUS = 30;
    static PIPE_RADIUS = 50;

    constructor(last, length, used) {
        this.last = last;
        this.length = length;
        this.used = used;
    }

    get key() {
        return this.used * 100 + this.last;
    }

    // get distance between centre of previous balls along the y axis
    getDistance(radius) {
        if (this.last === 0) {
            return radius;
        } else if (radius === 0) {
            return this.last;
        } else {
            const sum = this.last + radius;
            const d = 4 * State.PIPE_RADIUS * (sum - State.PIPE_RADIUS);
            return Math.sqrt(d);
        }
    }

    add(radius) {
        const index = radius - State.MIN_RADIUS;
        const mask = 2 ** index;

        if (this.used & mask) {
            return;
        }
        const distance = this.getDistance(radius);
        return new State(radius, this.length + distance, this.used | mask);
    }
}

function solve(minRadius, maxRadius, trace) {
    State.PIPE_RADIUS = maxRadius;
    State.MIN_RADIUS = minRadius;

    let states = new Map();
    let newStates = new Map();

    const start = new State(0, 0, 0);
    states.set(0, start);

    const tracer = new Tracer(trace);

    for (let i = minRadius; i <= maxRadius; i++) {
        tracer.print(() => `${maxRadius - i}: ${states.size}`);
        newStates.clear();
        for (const state of states.values()) {
            for (let r = minRadius; r <= maxRadius; r++) {
                const newState = state.add(r);
                if (newState) {
                    const k = newState.key;
                    const o = newStates.get(k);
                    if (o) {
                        o.length = Math.min(o.length, newState.length);
                    } else {
                        newStates.set(k, newState);
                    }
                }
            }
        }
        [newStates, states] = [states, newStates];
    }

    const best = [...states.values()].map((a) => a.length + a.getDistance(0)).sort((a, b) => a - b)[0];

    tracer.clear();
    return Math.round(best * 1000);
}

assert.strictEqual(solve(5, 10), 80298);

const answer = TimeLogger.wrap('', () => solve(30, 50, true));
console.log(`Answer is ${answer}`);
