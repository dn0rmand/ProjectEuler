const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e6;
const MAX_PRIME = MAX;
const MODULO = 999999893;
primeHelper.initialize(MAX_PRIME);

const $primes = [];
const $F = new Uint32Array(2e6);

function getPisanos(m) {
    $F[0] = 1;
    $F[1] = 0;
    $F[2] = 1;

    let l1 = undefined;

    for (let i = 3; ; i++) {
        $F[i] = ($F[i - 1] + $F[i - 2]) % m;
        if ($F[i - 1] === 1 && $F[i] === 0) {
            l1 = { length: i - 1, count: m * m - 1 };
            break;
        }
    }

    const l = l1.length / 2;

    if ($F[l + 1] !== 0) {
        return {
            l1: { length: l, count: m - 1 },
            l2: { length: l + l, count: m * m - m },
        };
    }

    return { l1 };
}

function getPrimeLengths(p, k) {
    const { l1, l2 } = $primes[p];
    const newLengths = { 1: 1 };

    if (p === 5) {
        newLengths[4] = l1.count;
        const pk1 = 5 ** (k - 1);
        const pk = pk1 * 5;
        newLengths[4 * pk] = pk1.modMul(pk1, MODULO).modMul(l2.count, MODULO);
        let previous = 1;
        for (let j = 1; j < k; j++) {
            const next = 5 * previous;
            const count = next + previous;
            const length = 4 * next;
            newLengths[length] ??= 0;
            newLengths[length] = ((newLengths[length] ?? 0) + count.modMul(length, MODULO)) % MODULO;
            previous = next;
        }
    } else if (l2 === undefined) {
        const p2 = p * p;
        let pj = 1;
        let ppj = 1;
        for (let j = 0; j < k; j++) {
            const length = l1.length * pj;
            const count = l1.count.modMul(ppj, MODULO);
            newLengths[length] = count;

            pj *= p;
            ppj *= p2;
        }
    } else {
        newLengths[l1.length] = l1.count;
        newLengths[l2.length] = l2.count;

        const p2 = p * p;
        let pj = 1;
        let ppj = 1;
        let A = (l1.length * l1.count) / l2.length;

        A = A.modMul(2, MODULO).modMul(p - 1, MODULO);

        for (let j = 1; j < k; j++) {
            const previous = pj;
            pj *= p;
            ppj *= p2;

            const length1 = l1.length * pj;
            const length2 = l2.length * pj;
            const count1 = l1.count.modMul(pj, MODULO);

            let tmp = 0;
            for (let i = 1; i <= j; i++) {
                tmp += p ** i;
            }
            tmp = tmp.modMul(A, MODULO);
            A = A.modMul(p, MODULO);

            const count2 = l2.count.modMul(ppj, MODULO) + tmp;

            newLengths[length1] = ((newLengths[length1] ?? 0) + count1) % MODULO;
            newLengths[length2] = ((newLengths[length2] ?? 0) + count2) % MODULO;
        }
    }
    return newLengths;
}

function getLengths(m) {
    let newLengths = { 1: 1 };

    primeHelper.factorize(m, (p, k) => {
        const lengths = getPrimeLengths(p, k);
        const tmp = {};

        for (let k1 in newLengths) {
            const l1 = +k1;
            const n1 = newLengths[k1];
            for (let k2 in lengths) {
                const l2 = +k2;
                const n2 = lengths[k2];
                const l = l1.lcm(l2);
                const c = n1.modMul(n2, MODULO);

                tmp[l] = ((tmp[l] ?? 0) + c) % MODULO;
            }
        }

        newLengths = tmp;
    });

    return newLengths;
}

function s(m) {
    const lengths = getLengths(m);
    let total = 0;

    for (const k in lengths) {
        let l = +k;
        l = l.modMul(l, MODULO);
        total = (total + lengths[k].modMul(l, MODULO)) % MODULO;
    }

    return total;
}

function preCalculate() {
    const tracer = new Tracer(true, 'preloading primes');

    $primes[2] = {
        l1: { length: 3, count: 3 },
        l2: undefined,
    };

    $primes[3] = {
        l1: { length: 8, count: 8 },
        l2: undefined,
    };

    $primes[5] = {
        l1: { length: 4, count: 4 },
        l2: { length: 20, count: 20 },
    };

    // pre-calculate for all the primes
    const allPrimes = [...primeHelper.allPrimes()].reverse();

    for (const m of allPrimes) {
        tracer.print(() => m);

        if (m <= 5) {
            continue;
        }

        const { l1, l2 } = getPisanos(m);

        $primes[m] = { l1, l2 };
    }
    tracer.clear();
}

function S(M, trace) {
    const tracer = new Tracer(trace, 'calculating');

    let total = 0;
    for (let m = 1; m <= M; m++) {
        tracer.print(() => M - m);
        total = (total + s(m)) % MODULO;
    }
    tracer.clear();
    return total;
}

function brute_Pisano(A, B, modulo) {
    A %= modulo;
    B %= modulo;
    let a = A;
    let b = B;

    for (let index = 1; ; index++) {
        [a, b] = [b, (a + b) % modulo];
        if (a === A && b === B) {
            return index;
        }
    }
}

function brute_s(modulo) {
    let total = 0;
    const lengths = {};

    for (let a = 0; a < modulo; a++) {
        for (let b = 0; b < modulo; b++) {
            const p = brute_Pisano(a, b, modulo);
            lengths[p] = (lengths[p] ?? 0) + 1;
            total = (total + p.modMul(p, MODULO)) % MODULO;
        }
    }
    const lengths2 = getLengths(modulo);

    return total;
}

function brute_S(modulo, trace) {
    let total = 0;
    const tracer = new Tracer(trace);
    for (let m = 1; m <= modulo; m++) {
        tracer.print(() => modulo - m);
        total = (total + brute_s(m)) % MODULO;
    }
    tracer.clear();

    return total;
}

TimeLogger.wrap('', (_) => preCalculate());

assert.strictEqual(s(3), 513);
assert.strictEqual(s(10), 225820);
assert.strictEqual(s(21), 111105);

assert.strictEqual(S(3), 542);
assert.strictEqual(S(10), 310897);
assert.strictEqual(S(100), 508043547);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(MAX, true));
console.log(`Answer is ${answer}`);
