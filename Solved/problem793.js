const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const MIN = (a, b) => a < b ? a : b;
const MAX = (a, b) => a < b ? b : a;

const MAX_VALUE = 1000003;

const compare = (a, b) => a < b ? -1 : (a > b ? 1 : 0);

const sequence = TimeLogger.wrap('Loading Sequence', _ => {
    const seq = new BigUint64Array(MAX_VALUE + 1);
    seq[0] = 290797n;

    let current = seq[0];
    for (let i = 1; i <= MAX_VALUE; i++) {
        current = (current * current) % 50515093n;
        seq[i] = current;
    }

    return seq;
});

function bigSearch(start, end, compare) {
    let min = start;
    let max = end;

    while (min < max) {
        const j = (min + max) / 2n;
        const v = compare(j);

        if (v < 0) {
            min = j + 1n;
        } else {
            max = j - 1n;
        }
    }

    max = MIN(end, MAX(start, max));
    if (compare(max) < 0) {
        return max;
    } else {
        return max - 1n;
    }
}

function search(start, end, compare) {
    let min = start;
    let max = end;

    while (min < max) {
        const j = Math.floor((min + max) / 2);
        const v = compare(j);

        if (v < 0) {
            min = j + 1;
        } else {
            max = j - 1;
        }
    }

    max = MIN(end, MAX(start, max));
    if (compare(max) < 0) {
        return max;
    } else {
        return max - 1;
    }
}

function M(n, trace) {
    const seq = sequence.slice(0, n);
    seq.sort(compare);

    const entries = n * ((n - 1) / 2);
    const target = (entries + 1) / 2;

    const min = seq[0] * seq[1];
    const max = seq[seq.length - 2] * seq[seq.length - 1];

    const tracer = new Tracer(trace);

    const answer = bigSearch(min, max, v => {
        let total = 0;
        for (let i = 0; i < seq.length; i++) {
            const vi = seq[i];
            const j = search(i + 1, seq.length - 1, k => {
                const vk = seq[k];
                const x = vi * vk;
                return x - v;
            });
            const c = MAX(j - i, 0);
            if (c === 0) {
                break;
            }
            total += c;
        }
        tracer.print(_ => total - target);
        return total - target;
    });

    tracer.clear();
    return answer;
}

assert.strictEqual(M(3), 3878983057768n);
assert.strictEqual(M(11), 139717475685424n);
assert.strictEqual(M(103), 492700616748525n);
assert.strictEqual(M(503), 513141732392608n);

assert.strictEqual(TimeLogger.wrap('', _ => M(5003, true)), 465534708372414n);

console.log('Tests passed');
answer = TimeLogger.wrap('Solving', _ => M(MAX_VALUE, true));
console.log(`Answer is ${answer}`);