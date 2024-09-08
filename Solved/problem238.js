const assert = require('assert');
const { TimeLogger, Tracer, digits: getDigits } = require('@dn0rmand/project-euler-tools');

const MAX = 2e15;

function* $sequence() {
    let s0 = 14025256;
    let s1 = s0;
    while (true) {
        const digits = getDigits(s1);
        for (const d of digits) {
            yield d;
        }
        s1 = s1.modMul(s1, 20300713);
        if (s1 === s0) {
            break;
        }
    }
}

class Sequence {
    static sums = [];

    static get totalSum() {
        return Sequence.sums[Sequence.size - 1].sum;
    }

    static get size() {
        return Sequence.sums.length;
    }

    static get(index) {
        return Sequence.sums[index];
    }

    static get maxIndex() {
        return Sequence.sums[Sequence.size - 1].index;
    }

    static prepare() {
        let count = 18886117; // that's how many digits the sequence will have
        let index = 1;
        let currentIndex = 1;
        let sum = 0;

        const tracer = new Tracer(true, 'Initializing Sequence');
        for (const digit of $sequence()) {
            if (digit) {
                tracer.print(() => count);
                count--;
                sum += digit;
                Sequence.sums.push({ sum, index: currentIndex, offset: sum - digit });
                currentIndex = ++index;
            } else {
                ++index;
            }
        }
        tracer.clear();
    }
}

Sequence.prepare();

class ProcessedArray {
    constructor() {
        this.data1 = new Uint8Array(Sequence.totalSum + 1);
        this.data2 = new Uint8Array(Sequence.totalSum + 1);
    }

    has(sum) {
        if (sum > Sequence.totalSum) {
            return this.data2[sum - Sequence.totalSum];
        } else {
            return this.data1[sum];
        }
    }

    add(sum) {
        if (sum > Sequence.totalSum) {
            this.data2[sum - Sequence.totalSum] = 1;
        } else {
            this.data1[sum] = 1;
        }
    }
}

function solve(max, trace) {
    const tracer = new Tracer(trace);

    let total = 0;
    let extra = 0n;
    let found = 0;
    let processed = new ProcessedArray();

    const addTotal = (times, index) => {
        found += times;
        const t = total + times * index;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra = BigInt(total) + BigInt(times) * BigInt(index);
            total = 0;
        } else {
            total = t;
        }
    };

    const print = (index) => {
        tracer.print(() => `${Sequence.maxIndex - index} - ${max - found}`);
    };

    function addSum(sum, index) {
        if (sum > max || processed.has(sum)) {
            return;
        }
        processed.add(sum);
        if (found < max) {
            let times = 1 + Math.floor((max - sum) / Sequence.totalSum);
            if (found + times > max) {
                times = max - found;
            }
            addTotal(times, index);
        }
    }

    function process(baseSum, index) {
        if (baseSum > max || found >= max) {
            return;
        }

        for (const { sum } of Sequence.sums) {
            if (found >= max) {
                break;
            }
            const s = sum + baseSum;
            if (s > max) {
                break;
            }
            addSum(s, index);
        }
    }

    for (let i = 0; found < max && i < Sequence.size; i++) {
        let { offset, index } = Sequence.get(i);
        let sum;
        for (let j = i; found < max && j < Sequence.size; j++) {
            print(index);
            sum = Sequence.get(j).sum - offset;
            if (sum > max) {
                break;
            }
            if (!processed.has(sum)) {
                processed.add(sum);
                addTotal(1, index);
            }
        }

        process(sum, index);
    }

    tracer.clear();
    return BigInt(total) + extra;
}

assert.strictEqual(solve(1000), 4742n);
assert.strictEqual(solve(10000), 49541n);
assert.strictEqual(solve(100000), 496317n);
assert.strictEqual(solve(1000000), 4969211n);

assert.strictEqual(
    TimeLogger.wrap('1e8', () => solve(10 ** 8, true)),
    496143530n
);
assert.strictEqual(
    TimeLogger.wrap('1e9', () => solve(10 ** 9, true)),
    4961284751n
);

console.log('Tests passed');

const answer = TimeLogger.wrap('2e15', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
