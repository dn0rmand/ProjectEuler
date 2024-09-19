const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 60_000_000;
const MAX_DT = 23050;

const MAX_PRIME = Math.ceil(Math.sqrt(MAX)) + 1;
const MODULO = 10n ** 18n;

primeHelper.initialize(MAX_PRIME);

function T(n) {
    if (n & 1) {
        return ((n + 1) / 2) * n;
    } else {
        return (n / 2) * (n + 1);
    }
}

const $dT = [0, 1];

function dT(n) {
    if (!$dT[n]) {
        let total = 1;
        let x = 2;
        const action = (p, e) => {
            if (p === x) {
                x = 1;
                e -= 1;
            }
            if (e) {
                total *= e + 1;
            }
        };

        primeHelper.factorize(n, action);
        primeHelper.factorize(n + 1, action);
        $dT[n] = total;
    }
    return $dT[n];
}

const singles = new BigUint64Array(MAX_DT);
const doubles = new BigUint64Array(MAX_DT);

function Tr(max, trace) {
    singles.fill(0n);
    doubles.fill(0n);

    let triples = 0n;
    const tracer = new Tracer(trace);

    for (let n = 1; n <= max; n++) {
        tracer.print(() => max - n);
        const dt = dT(n);

        triples = (triples + doubles[dt]) % MODULO;

        for (let dt0 = 1; dt0 < dt; dt0++) {
            doubles[dt0] = doubles[dt0] + singles[dt];
            singles[dt0] = singles[dt0] + 1n;
        }
    }
    tracer.clear();

    return triples;
}

assert.strictEqual(T(7), 28);
assert.strictEqual(dT(7), 6);
assert.strictEqual(Tr(20), 14n);
assert.strictEqual(Tr(100), 5772n);
assert.strictEqual(Tr(1000), 11174776n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => Tr(MAX, true));
console.log(`Answer is ${answer}`);
