const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 10n ** 16n;
const MAX_VALUE = 250250;
const SUM_MODULO = 250;

const binomial = [];

function prepareBinomials(counts) {
    counts = counts.filter((v) => v).sort((a, b) => a - b);

    // prepare binomials

    for (const count of counts) {
        const row = [1n];
        binomial[count] = row;
        let result = 1n;
        const n = BigInt(count);
        for (let p = 1n; p <= count; p++) {
            result = (result * (n - p + 1n)) / p;
            row.push(result % MODULO);
        }
    }
}

function getWholeSet() {
    const set = new Map();

    for (let i = 1; i <= MAX_VALUE; i++) {
        const v = i.modPow(i, SUM_MODULO);
        set.set(v, (set.get(v) || 0) + 1);
    }
    const r = [];
    const counts = [];
    set.forEach((count, value) => {
        r.push({ value, count });
        counts[count] = count;
    });
    prepareBinomials(counts);
    return r;
}

function process(values) {
    const $memoize = [];

    const zeroes = (function () {
        const count = values.find((v) => v.value === 0).count;
        const ways = binomial[count].reduce((a, b) => (a + b) % MODULO, 0n);
        return ways;
    })();

    const sets = values.filter((v) => v.value); // Remove the zero sum

    function inner(sum, index) {
        if (index >= sets.length) {
            return sum ? 0n : zeroes;
        }

        const key = index * SUM_MODULO + sum;
        if ($memoize[key]) {
            return $memoize[key];
        }

        const { value, count } = sets[index];

        let total = inner(sum, index + 1); // When not using those

        for (let times = 1; times <= count; times++) {
            const w1 = binomial[count][times];
            if (w1) {
                const s = (sum + value.modMul(times, SUM_MODULO)) % SUM_MODULO;
                const w2 = inner(s, index + 1);
                total = (total + w1.modMul(w2, MODULO)) % MODULO;
            }
        }

        $memoize[key] = total;
        return total;
    }

    const total = inner(0, 0);

    // Remove the empty one :)

    return (total + MODULO - 1n) % MODULO;
}

function solve() {
    const values = getWholeSet();
    return process(values);
}

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer}`);
