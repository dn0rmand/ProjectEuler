const assert = require('assert');

const ABS = a => a < 0 ? -a : a;
const MAX = (a, b) => a > b ? a : b;
const MIN = (a, b) => a < b ? a : b;

const ZERO = 0;
const FIVE = 5;

const divise = (a, b, precision) => (a / b).toFixed(precision);


class State {
    constructor(offset, total, count) {
        this.offset = offset;
        this.total = total;
        this.count = count || 1;
    }

    get key() {
        return this.offset;
    }

    add(robin, pooh) {
        let time = MIN(robin, pooh);
        if (ABS(this.offset + robin - pooh) > time && robin !== pooh)
            return undefined; // Win state

        let s = new State(this.offset, this.total, this.count);

        s.total += (MAX(robin, pooh) + FIVE) * this.count;
        s.offset += (robin - pooh);

        return s;
    }
}

function E(max, min) {
    // max = BigInt(max);
    // min = BigInt(min);

    let states = new Map();
    let newStates = new Map();

    let winTime = ZERO;
    let winCount = ZERO;
    let result = 0;

    states.set('x', new State(ZERO, ZERO));

    while (states.size > 0) {
        newStates.clear();

        for (const state of states.values()) {
            for (let pooh = min; pooh <= max; pooh++)
                for (let robin = min; robin <= max; robin++) {
                    let s = state.add(robin, pooh);

                    if (s === undefined) {
                        winTime += state.total + MIN(robin, pooh) * state.count;
                        winCount += state.count;

                        if (!Number.isFinite(winTime) || !Number.isFinite(winCount)) {
                            return result;
                        }

                        result = divise(winTime, winCount, 4);

                        continue;
                    }

                    if (!Number.isFinite(s.total) || !Number.isFinite(s.count))
                        continue;

                    let k = s.key;
                    let o = newStates.get(k);
                    if (o) {
                        o.total += s.total;
                        o.count += s.count;
                    } else {
                        newStates.set(k, s);
                    }
                }
        }

        [states, newStates] = [newStates, states];
    }

    return result;
}

assert.equal(E(60, 30), 1036.15);

console.log('Tests passed');