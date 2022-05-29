const {
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

class State {
    constructor(p, score) {
        this.probability = p;
        this.score = score;
    }

    win(q, distance) {
        const p = this.probability * (1 - distance / q);
        const s = new State(p, this.score + 1);
        return s;
    }

    miss(q, distance) {
        const p = this.probability * (distance / q);
        const s = new State(p, this.score);

        return s;
    }
}

function evaluate(q) {
    const state = new State(1, 0);

    let states = new Map();
    let newStates = new Map();

    states.set(0, state);

    const add = s => {
        const k = s.score;
        const o = newStates.get(k);
        if (o) {
            o.probability += s.probability;
        } else {
            newStates.set(k, s);
        }
    };

    for (let distance = 1; distance <= 50; distance++) {
        newStates.clear();

        for (const state of states.values()) {
            if (state.score < 20) {
                add(state.win(q, distance));
            }
            add(state.miss(q, distance));
        }

        [states, newStates] = [newStates, states];
    }

    const o = states.get(20);
    if (o === undefined) {
        throw "ERROR";
    }

    return o.probability;
}

function solve(min, max) {
    while (min < max) {
        const q = (min + max) / 2;
        const p = evaluate(q);
        const v = p.toFixed(13);
        if (v === '0.0200000000000') {
            return q;
        }

        if (p < 0.02) {
            max = q;
        } else if (p > 0.02) {
            min = q;
        }
    }
}

const answer = TimeLogger.wrap('', _ => solve(50, 55));
console.log(`Answer is ${answer.toFixed(10)}`);