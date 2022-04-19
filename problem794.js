const assert = require('assert');

const {
    PreciseNumber,
    Tracer,
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

const lt = (v1, v2) => v1.less(v2);
const lte = (v1, v2) => !v2.less(v1);
const includes = (interval, value) => lte(interval.min, value) && lt(value, interval.max);
const compare = (v1, v2) => v1.less(v2) ? -1 : (v2.less(v1) ? 1 : 0);

const $intervals = [];

function buildIntervals(n) {
    if ($intervals[n] !== undefined) {
        return $intervals[n];
    }

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

    $intervals[n] = intervals;
    return intervals;
}

const emptyInterval = {
    min: PreciseNumber.Zero,
    max: PreciseNumber.Zero
};

function intersects({
    min: min1,
    max: max1
}, {
    min: min2,
    max: max2
}) {
    if (lt(max1, min2) || lt(max2, min1)) {
        return emptyInterval
    }
    if (lte(max2, max1) && lte(min2, min1)) {
        return {
            min: min1,
            max: max1
        };
    }
    if (lte(min1, min2) && lte(max2, max1)) {
        return {
            min: min2,
            max: max2
        };
    }
    if (lte(min1, min2)) {
        return {
            min: min2,
            max: max1
        };
    }
    if (lte(max1, max2)) {
        return {
            min: min1,
            max: max2
        };
    }

    throw "ERROR";
}

function buildGroups(intervals, values) {
    const groups = [];

    for (let i = 0; i < intervals.length; i++) {
        groups[i] = [];
        for (let value of values) {
            if (includes(intervals[i], value)) {
                groups[i].push(value);
            }
        }
    }

    return groups;
}

function quickCheck(n, values) {
    let intervals = buildIntervals(n);
    if (intervals.length !== values.length) {
        return false;
    }

    let groups = buildGroups(intervals, values);
    if (groups.some(g => g.length !== 1)) {
        return false;
    }

    return true;
}

function validate(n, values) {
    if (!quickCheck(n, values)) {
        return false;
    }

    function inner(s, values) {
        if (values.length !== s) {
            return false;
        }
        if (s === 1) {
            return true;
        }

        intervals = buildIntervals(s - 1);
        groups = buildGroups(intervals, values);
        if (groups.some(g => g.length === 0)) {
            return false;
        }
        const doubles = groups.filter(g => g.length > 1);
        if (doubles.length !== 1 && doubles[0].length !== 2) {
            // Something's not right
            return false;
        }
        // Remove value 1
        if (inner(s - 1, values.filter(v => !v.equals(doubles[0][0])))) {
            return true;
        }

        return inner(s - 1, values.filter(v => !v.equals(doubles[0][1])));
    }

    return inner(n, values);
}

function step(n, maxStep, values) {
    if (n > maxStep) {
        return values;
    }

    let intervals = buildIntervals(n);
    const groups = buildGroups(intervals, values);
    if (groups.some(g => g.length > 1)) {
        return [];
    }
    let empty = groups.findIndex(g => g.length === 0);
    if (empty < 0) {
        return [];
    }

    intervals = [intervals[empty]];

    let mins = [intervals[0].min];

    for (let k = n + 1; k <= maxStep; k++) {
        const newIntervals = [];
        const newMins = [];
        const keys = new Set();
        const minKeys = new Set();

        for (const i1 of buildIntervals(k)) {
            for (const i2 of intervals) {
                const i = intersects(i1, i2);

                if (i.min.equals(i.max)) {
                    continue;
                }
                const key = `${i.min.toString()}:${i.max.toString()}`;
                if (!keys.has(key)) {
                    keys.add(key);
                    newIntervals.push(i);
                }
                const mKey = i.min.toString();
                if (!minKeys.has(mKey)) {
                    minKeys.add(mKey);
                    newMins.push(i.min);
                }
            }
        }

        if (newIntervals.length === 0) {
            return [];
        }

        intervals = newIntervals;
        mins = newMins;
    }

    return mins; // intervals.map(v => v.min);
}

function F(n, trace) {
    let states = new Map();
    let newStates = new Map();

    const getSum = state => state.reduce((a, v) => a.plus(v), PreciseNumber.Zero);
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
                const newState = [...values, value].sort(compare);
                if (!quickCheck(s, newState)) {
                    continue;
                }

                const key = makeKey(newState);

                newStates.set(key, newState);
            }
        }
        if (newStates.length === 0) {
            throw "ERROR: No more state";
        }
        [states, newStates] = [newStates, states];
    }

    tracer.clear();
    const sum = [...states.values()].reduce((sum, state) => {
        if (!validate(n, state)) {
            return sum;
        }
        let newSum = getSum(state);
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
    return sum.valueOf(12).toFixed(12);
}

assert.strictEqual(F(4), '1.500000000000');
assert.strictEqual(TimeLogger.wrap('', _ => F(11, true)), '5.025974025974');
assert.strictEqual(TimeLogger.wrap('', _ => F(12, true)), '5.541666666666');

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => F(17, true));
console.log(`Answer is ${answer}`);