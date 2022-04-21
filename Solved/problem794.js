const assert = require('assert');

const {
    PreciseNumber,
    Tracer,
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

PreciseNumber.setUseBigInt(false);

const lt = (v1, v2) => v1.less(v2);
const lte = (v1, v2) => !v2.less(v1);

class Interval {
    static emptyInterval = new Interval(PreciseNumber.Zero, PreciseNumber.Zero);

    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.$key = undefined;
    }

    get isEmpty() {
        return this.min.equals(this.max);
    }
    get key() {
        if (this.$key === undefined) {
            this.$key = `${this.min.toString()}:${this.max.toString()}`;
        }
        return this.$key;
    }

    equals(other) {
        return this.min.equals(other.max) && this.max.equals(other.max);
    }

    intersects(other) {
        if (lt(this.max, other.min) || lt(other.max, this.min)) {
            return Interval.emptyInterval
        }
        if (lte(other.max, this.max) && lte(other.min, this.min)) {
            return this;
        }
        if (lte(this.min, other.min) && lte(other.max, this.max)) {
            return other;
        }
        if (lte(this.min, other.min)) {
            return new Interval(other.min, this.max);
        }
        if (lte(this.max, other.max)) {
            return new Interval(this.min, other.max);
        }

        throw "ERROR";
    }

    includes(value) {
        return lte(this.min, value) && lt(value, this.max);
    }

    some(values) {
        return values.some(v => this.includes(v));
    }
}

const $intervals = [];

function buildIntervals(n) {
    if ($intervals[n] !== undefined) {
        return $intervals[n];
    }

    const intervals = [];
    let min = PreciseNumber.Zero;
    for (let k = 0; k < n; k++) {
        let max = PreciseNumber.create(k + 1, n);
        intervals.push(new Interval(min, max));
        min = max;
    }

    $intervals[n] = intervals;
    return intervals;
}

class State {
    constructor(values, step) {
        this.values = values.sort((v1, v2) => v1.less(v2) ? -1 : (v2.less(v1) ? 1 : 0));
        this.step = step;
        this.$key = undefined;
    }

    get sum() {
        if (this.values && this.values.length) {
            return this.values.reduce((a, v) => a.plus(v), PreciseNumber.Zero);
        } else {
            return PreciseNumber.Zero;
        }
    }

    get key() {
        if (this.$key === undefined) {
            this.$key = this.values.map(v => v.toString()).join(':');
        }
        return this.$key;
    }

    isValid() {
        let intervals = buildIntervals(this.step);
        if (intervals.length !== this.values.length) {
            return false;
        }

        let groups = this.groups(intervals);
        if (groups.some(g => g.length !== 1)) {
            return false;
        }

        return true;
    }

    groups(intervals) {
        const g = [];

        for (let i = 0; i < intervals.length; i++) {
            g[i] = [];
            for (let value of this.values) {
                if (intervals[i].includes(value)) {
                    g[i].push(value);
                }
            }
        }

        return g;
    }

    next(maxStep, callback) {
        const step = this.step + 1;
        if (step > maxStep) {
            throw "ERROR";
        }

        let intervals = buildIntervals(step);
        const groups = this.groups(intervals);
        if (groups.some(g => g.length > 1)) {
            return;
        }
        const emptyIndex = groups.findIndex(g => g.length === 0);
        if (emptyIndex < 0) {
            return;
        }
        const empty = intervals[emptyIndex];
        intervals = [empty];

        if (step === maxStep) {
            const newState = new State([...this.values, intervals[0].min], step);
            callback(newState);
            return;
        }

        for (let k = step + 1; k <= maxStep; k++) {
            const newIntervals = [];
            const keys = new Set();
            const minKeys = new Set();

            for (const i1 of buildIntervals(k)) {
                if (i1.some(this.values)) {
                    continue;
                }

                for (const i2 of intervals) {
                    const i = i1.intersects(i2);

                    if (i.isEmpty) {
                        continue;
                    }
                    if (!keys.has(i.key)) {
                        keys.add(i.key);
                        newIntervals.push(i);
                    }

                    if (k === maxStep) {
                        const mKey = i.min.toString();
                        if (!minKeys.has(mKey)) {
                            minKeys.add(mKey);

                            const newState = new State([...this.values, i.min], step);
                            if (newState.isValid()) {
                                callback(newState);
                            }
                        }
                    }
                }
            }

            if (newIntervals.length === 0) {
                return;
            }

            intervals = newIntervals;
        }
    }
}

function F(n, trace) {
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State([PreciseNumber.Zero], 1));

    const tracer = new Tracer(trace);

    for (let s = 2; s <= n; s++) {
        newStates.clear();
        let count = states.size;
        for (const state of states.values()) {
            tracer.print(_ => `${n-s} : ${count} - ${newStates.size}`);
            count--;
            state.next(n, newState => {
                newStates.set(newState.key, newState);
            });
        }
        if (newStates.size === 0) {
            throw "ERROR: No more state";
        }
        [states, newStates] = [newStates, states];
    }

    tracer.clear();
    const sum = [...states.values()].reduce((sum, state) => {
        let newSum = state.sum;
        if (sum.equals(PreciseNumber.Zero)) {
            return newSum;
        } else if (newSum.less(sum)) {
            return newSum;
        }
        return sum;
    }, PreciseNumber.Zero);

    if (sum.equals(0)) {
        throw "ERROR: No valid states";
    }
    return sum.valueOf(14).toFixed(12);
}

assert.strictEqual(F(4), '1.500000000000');
assert.strictEqual(TimeLogger.wrap('', _ => F(11)), '5.025974025974');
assert.strictEqual(TimeLogger.wrap('', _ => F(12)), '5.541666666667');

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => F(17, true));
console.log(`Answer is ${answer}`);