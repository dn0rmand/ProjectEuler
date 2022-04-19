const assert = require('assert');

const {
    PreciseNumber,
    Tracer
} = require('@dn0rmand/project-euler-tools');

function buildIntervals(n) {
    const intervals = [];
    let min = PreciseNumber.Zero;
    for (let k = 0; k < n; k++) {
        let max = PreciseNumber.create(k + 1, n);
        intervals.push({
            min,
            max
        });
        min = max;
    }

    return intervals;
}

function step(n, maxStep, values) {
    if (n > maxStep) {
        return values;
    }

    const lt = (v1, v2) => v1.less(v2);
    const lte = (v1, v2) => !v2.less(v1);

    let intervals = buildIntervals(n).filter(({
        min,
        max
    }) => {
        const found = values.some(v => lte(min, v) && lt(v, max));
        return !found;
    });

    if (intervals.length !== 1) {
        return [];
    }

    for (let k = n + 1; k <= maxStep; k++) {
        let newIntervals = [];
        for (const {
                min: min1,
                max: max1
            } of buildIntervals(k)) {
            for (const {
                    min,
                    max
                } of intervals) {
                if (lt(max1, min) || lt(max, min1)) {
                    continue;
                }
                if (lte(max, max1) && lte(min, min1)) {
                    newIntervals.push({
                        min: min1,
                        max: max1
                    });
                } else if (lte(min1, min) && lte(max, max1)) {
                    newIntervals.push({
                        min,
                        max
                    });
                } else if (lte(min1, min)) {
                    newIntervals.push({
                        min,
                        max: max1
                    });
                } else if (lte(max1, max)) {
                    newIntervals.push({
                        min: min1,
                        max
                    });
                } else {
                    throw "ERROR";
                }
            }
        }
        if (newIntervals.length === 0) {
            return [];
        }
        intervals = []
        // Remove empty ones
        newIntervals = newIntervals.filter(i => !i.min.equals(i.max));
        // Remove duplicates ones
        for (let i = 0; i < newIntervals.length; i++) {
            let interval = newIntervals[i];
            let found = intervals.some(({
                min,
                max
            }, index) => {
                if (index === i) {
                    return false;
                }
                if (min.equals(interval.min) && max.equals(interval.max)) {
                    return true;
                }
                return false;
            });
            if (!found) {
                intervals.push(interval);
            }
        }
    }
    intervals.sort((a, b) => a.min.less(b.min) ? -1 : (b.min.less(a.min) ? 1 : 0));

    return intervals.map(v => v.min);
}

function F(n, trace) {
    let states = new Map();
    let newStates = new Map();

    const makeKey = state => state.map(v => v.toString()).join(':');

    states.set(0, []);

    const tracer = new Tracer(trace);

    for (let s = 1; s <= n; s++) {
        newStates.clear();
        let count = states.size;
        for (const values of states.values()) {
            tracer.print(_ => `${n-s} : ${count} - ${newStates.size}`);
            count--;
            for (const value of step(s, n, values)) {
                const newState = [...values, value].sort((v1, v2) => v1.less(v2) ? -1 : (v2.less(v1) ? 1 : 0));
                const key = makeKey(newState);

                newStates.set(key, newState);
            }
        }
        [states, newStates] = [newStates, states];
    }

    tracer.clear();
    const sum = [...states.values()].reduce((sum, values) => {
        let newSum = values.reduce((a, v) => a.plus(v), PreciseNumber.Zero);
        if (sum.equals(PreciseNumber.Zero)) {
            return newSum;
        } else if (newSum.less(sum)) {
            return newSum;
        }
        return sum;
    }, PreciseNumber.Zero);
    return sum.valueOf().toFixed(12);
}

assert.strictEqual(F(4), '1.500000000000');

console.log(F(17, true));