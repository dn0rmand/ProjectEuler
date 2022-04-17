const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const MAX = 1000003;

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
    for (let i = 0; i < seq.length - 1; i++) {
        const vi = seq[i];
        const min = vi * seq[i + 1];
        const max = vi * seq[seq.length - 1];

        if (min >= x) {
            break;
        } else if (max < x) {
            total += (seq.length - 1) - i;
        } else if (max === x) {
            total += (seq.length - 1) - i - 1;
        } else {
            const compare = j => {
                const k = vi * seq[j];
                return k < x ? -1 : (k > x ? 1 : 0);
            };

            let j = search(i + 1, seq.length - 1, compare, false);
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

function M(n, trace) {
    $count.clear();

    const seq = sequence.slice(0, n);
    seq.sort(compare);

    const entries = n * ((n - 1) / 2);
    const target = (entries - 1) / 2; // entries always odd

    let answer = undefined;
    const tracer = new Tracer(trace);

    let remaining = Math.floor(n / 2);

    function searchJ(i) {
        tracer.print(_ => remaining);
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

        let j = search(i + 1, n - 1, compare, true);
        return compare(j);
    }

    function searchI() {
        function* nextI() {
            const values = new Set();
            for (let i = 0; i < Math.floor(n / 2); i++) {
                values.add(i);
            }

            while (values.size) {
                const i = Math.floor(Math.random() * values.size);
                const k = [...values.keys()][i];
                values.delete(k);
                yield k;
            }
        }

        for (const i of nextI()) {
            searchJ(i);
            if (answer) {
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

assert.strictEqual(M(3), 3878983057768n);
assert.strictEqual(M(11), 139717475685424n);
assert.strictEqual(M(103), 492700616748525n);
assert.strictEqual(M(503), 513141732392608n);
assert.strictEqual(TimeLogger.wrap('', _ => M(5003, true)), 465534708372414n);

console.log('Tests passed');

const answer = TimeLogger.wrap('Solving', _ => M(MAX, true));
console.log(`Answer is ${answer}`);