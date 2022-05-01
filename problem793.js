const assert = require('assert');
const fs = require('fs');

const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const overrideDirection = (function () {
    for (const v of process.argv) {
        if (v.toLowerCase().startsWith('direction=')) {
            const x = v.substring(10);
            return +x;
        }
    }
})();

const MAX = 1000003;
const STATE_FILE = './problem793.json';
const SAVE_SPEED = 10 * 1000; // 10 seconds before next save

const compare = (a, b) => a < b ? -1 : (a > b ? 1 : 0);

const sequence = TimeLogger.wrap('Loading Sequence', _ => {
    const seq = new BigUint64Array(MAX + 1);
    seq[0] = 290797n;

    let current = seq[0];
    for (let i = 1; i <= MAX; i++) {
        current = (current * current) % 50515093n;
        seq[i] = current;
    }

    return seq;
});

let lastSaved = Date.now();

function getState() {
    if (fs.existsSync(STATE_FILE)) {
        const json = fs.readFileSync(STATE_FILE);
        const state = JSON.parse(json);
        if (overrideDirection === 1 || overrideDirection === -1) {
            state.direction = overrideDirection;
        }
        lastSaved = Date.now();
        return state;
    }
}

function saveState(remaining, current, oldState) {
    if ((Date.now() - lastSaved) >= SAVE_SPEED) { // 10 seconds
        const state = {
            ...oldState,
            current,
            remaining,
        };

        state.low = Math.min(state.current, state.low || Number.MAX_SAFE_INTEGER);
        state.hi = Math.max(state.current, state.hi || 0);

        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        lastSaved = Date.now();
    }
}

function search(start, end, compare, exactMatch) {
    let min = start;
    let max = end;

    while (min < max) {
        const j = Math.floor((min + max) / 2);
        const v = compare(j);
        if (exactMatch && v === 0) {
            return j;
        }

        if (v < 0) {
            min = j + 1;
        } else {
            max = j - 1;
        }
    }

    max = Math.min(end, Math.max(start, max));

    switch (compare(max)) {
        case 0:
            return exactMatch ? max : max - 1;
        case 1:
            return max - 1;
        default:
            return max;
    }
}

const $count = new Map();

function count(x, seq, maximum) {
    let total = $count.get(x);
    if (total !== undefined) {
        return total;
    }

    total = 0;

    const lastValue = seq[seq.length - 1];

    let start = 0;

    if ((seq[0] * seq[1]) >= x) {
        start = 0;
    } else if ((seq[0] * lastValue) >= x) {
        start = 0;
    } else {
        start = search(0, seq.length - 2, i => {
            const max = seq[i] * lastValue;
            if (max < x) {
                return -1;
            } else if (max === x) {
                return 0;
            } else {
                return 1;
            }
        });

        if (start >= 0) {
            total += (start * (seq.length - 1)) - (start * (start - 1)) / 2;
        } else {
            start = 0;
        }
    }

    const compare = (i, vi) => j => {
        const k = vi * seq[j];
        return k < x ? -1 : (k > x ? 1 : 0);
    };

    for (let i = start; i < seq.length - 1; i++) {
        const vi = seq[i];
        const min = vi * seq[i + 1];
        const max = vi * lastValue;

        if (min >= x) {
            break;
        } else if (max < x) {
            total += (seq.length - 1) - i;
        } else if (max === x) {
            total += (seq.length - 1) - i - 1;
        } else {
            let j = search(i + 1, seq.length - 1, compare(i, vi), false);
            if (j - i <= 0) {
                break;
            }
            total += j - i;
        }
        if (total > maximum) {
            break; // No need to check more
        }
    }

    $count.set(x, total);

    return total;
}

function M(n, trace, state) {
    $count.clear();

    const seq = sequence.slice(0, n);
    seq.sort(compare);

    const entries = n * ((n - 1) / 2);
    const target = (entries - 1) / 2; // entries always odd

    let answer = undefined;
    const tracer = new Tracer(trace);

    let remaining = state ? state.remaining : n;

    function searchJ(i) {
        tracer.print(_ => {
            let ratio;
            try {
                ratio = n / state.current;
            } catch (e) {
                ratio = Infinity;
            }
            return `${remaining} - ${ratio.toFixed(4)}`;
        });
        remaining--;
        const vi = seq[i];

        const compare = j => {
            const x = seq[j] * vi;
            const c = count(x, seq, target);

            const a = c < target ? -1 : (c > target ? 1 : 0);
            if (a === 0) {
                answer = x;
            }
            return a;
        };

        search(i + 1, n - 1, compare, true);
    }

    function searchI() {
        function* nextI() {
            const middle = Math.floor(n / 2);

            const getMax = (v1, v2) => {
                if (v1 === undefined) {
                    return Math.max(v2, middle + 1);
                }
                if (v2 === undefined) {
                    return Math.max(v1, middle + 1);
                }
                const v = Math.max(v1, v2);
                return Math.max(v, middle + 1);
            }

            const getMin = (v1, v2) => {
                if (v1 === undefined) {
                    return Math.min(v2, middle);
                }
                if (v2 === undefined) {
                    return Math.min(v1, middle);
                }
                const v = Math.min(v1, v2)
                return Math.min(v, middle);
            }


            if (n < 10) {
                for (let i = 0; i < n; i++) {
                    yield i;
                }
                return;
            }

            if (!state) {
                state = {
                    low: middle,
                    hi: middle + 1,
                    current: middle,
                    direction: -1
                };
            } else if (state.direction === 1) {
                state.current = getMax(state.current, state.hi);
                state.hi = state.current;
            } else {
                state.current = getMin(state.current, state.low);
                state.low = state.current;
                state.direction = -1;
            }

            if (state.direction === -1) {
                for (let i = state.current; i >= 0; i--) {
                    yield i;
                }
                state.direction = 1;
                if (state.hi) {
                    state.current = state.hi;
                } else {
                    state.current = middle + 1;
                }
                for (let i = state.current; i < n; i++) {
                    yield i;
                }
            } else {
                state.direction = 1;
                for (let i = state.current; i < n; i++) {
                    yield i;
                }
                state.direction = -1;
                if (state.low) {
                    state.current = state.low;
                } else {
                    state.current = middle;
                }
                for (let i = state.current; i >= 0; i--) {
                    yield i;
                }
            }
        }

        for (const i of nextI()) {
            searchJ(i);
            if (n === MAX) {
                saveState(remaining, i, state);
            }

            if (answer) {
                console.log(`\r${n} -> ${i} : ${Math.floor(n/i)}`);
                break;
            }
        }
    }

    searchI();
    tracer.clear();
    if (answer === undefined) {
        throw "Didn't find it";
    }
    return answer;
}

const state = getState();
let answer = -1;
if (!state) {
    assert.strictEqual(M(3), 3878983057768n);
    assert.strictEqual(M(11), 139717475685424n);
    assert.strictEqual(M(103), 492700616748525n);
    assert.strictEqual(M(503), 513141732392608n);

    assert.strictEqual(TimeLogger.wrap('', _ => M(5003, true)), 465534708372414n);

    console.log('Tests passed');
    // answer = TimeLogger.wrap('Solving', _ => M(MAX, true));
} else {
    answer = TimeLogger.wrap('Solving', _ => M(MAX, true, state));
}

console.log(`Answer is ${answer}`);