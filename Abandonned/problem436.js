const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const PRECISION = 2000;
const THRESHOLD = 1e-50;

class State {
    constructor(start, end, probability) {
        this.start = start;
        this.end = end;
        this.probability = probability;
    }

    get key() {
        return this.start * PRECISION * 10 + this.end;
    }

    *moves() {
        for (let v = 0; v < PRECISION; v++) {
            yield {
                state: new State(this.start, this.end + v, this.probability / PRECISION),
                lastPlay: v,
            };
        }
    }
}

function process() {
    let states = new Map();
    let newStates = new Map();

    let result = [];

    for (let i = 0; i < PRECISION; i++) {
        result[i] = new Map();
        states.set(i, new State(i, i, 1));
    }

    const add = (state, lastPlay) => {
        if (state.end > PRECISION) {
            const m = result[lastPlay];
            const k = state.key;
            let o = m.get(k);
            if (o === undefined) {
                o = [];
                m.set(k, o);
            }
            o[lastPlay] = (o[lastPlay] || 0) + state.probability;
        } else {
            const k = state.key;
            const o = newStates.get(k);
            if (o) {
                o.probability += state.probability;
            } else if (state.probability > THRESHOLD) {
                newStates.set(k, state);
            }
        }
    };

    const tracer = new Tracer(true);
    while (states.size > 0) {
        newStates.clear();
        let size = states.size;
        for (const state of states.values()) {
            for (const { state: newState, lastPlay } of state.moves()) {
                tracer.print(() => `${size}: ${newStates.size}`);
                add(newState, lastPlay);
            }
            size--;
        }
        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    return result;
}

function solve1() {
    const positions = process();

    let total = 0;

    for (let p1 = 1; p1 < PRECISION; p1++) {
        const m = positions[p1];

        for (let end = 1; end < PRECISION; end++) {
            const k = new State(0, PRECISION + end, 1).key;
            const p = (m.get(k) || [])[p1] || 0;
            if (!p) {
                continue;
            }
        }
    }

    return total;
}

function solve() {
    const $cache = [];
    function inner(remaining, target, lastPlay) {
        if (remaining < 0) {
            if (target !== 0) {
                return lastPlay > target ? 1 : 0;
            } else {
                target = lastPlay;
                remaining += PRECISION;
            }
        }

        let total = ($cache[remaining] || [])[target];
        if (total !== undefined) {
            return total;
        }
        total = 0;

        if (target) {
            // anything above target and above remaining is a direct win
            let min = Math.max(remaining, target);
            let count = PRECISION - (min + 1);
            if (count > 0) {
                total = count / PRECISION;
            }
            for (let play = min; play; play--) {
                total += inner(remaining - play, target, play) / PRECISION;
            }
        } else {
            for (let play = PRECISION - 1; play; play--) {
                total += inner(remaining - play, target, play) / PRECISION;
            }
        }

        if (!$cache[remaining]) {
            $cache[remaining] = [];
        }
        $cache[remaining][target] = total;
        return total;
    }

    return inner(PRECISION, 0, 0);
}

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer.toFixed(10)}`);
