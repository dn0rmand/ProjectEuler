const assert = require('assert');
const {
    Tracer,
    primeHelper,
    TimeLogger: timeLogger
} = require('@dn0rmand/project-euler-tools');

const MAX = 1E12;
const MAX_PRIME = 1E7;
const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);

primeHelper.initialize(MAX_PRIME);

const TWO = Number(2);

function fp(p, e) {
    if (p === 2) {
        return TWO.modPow(e * 6 - 1, MODULO);
    } else {
        const p2 = (3 * (p - 1) / 2) & 1 ? -1 : 1;
        const e64 = p.modPow(e * 6 - 4, MODULO);
        let p3 = p.modPow(3, MODULO) - p2;
        while (p3 < 0)
            p3 += MODULO;

        return (p - 1).modMul(e64, MODULO).modMul(p3, MODULO);
    }
}

function f(n) {
    let total = 1;

    primeHelper.factorize(n, (p, e) => {
        total = total.modMul(fp(p, e), MODULO);
    });

    return total;
}

function FP(p, e) {
    let result;

    if (p === 2) {
        result = p.modPow(3 * e, MODULO);
    } else if (p % 4 === 1) {
        const p3 = p.modPow(3, MODULO);
        const p31 = p3 - 1;

        result = p31.modMul(p3.modPow(e - 1, MODULO), MODULO);
    } else {
        const p3 = p.modPow(3, MODULO);
        const p31 = p3 + 1;

        result = p31.modMul(p3.modPow(e - 1, MODULO), MODULO);
    }

    return result;
}

function F(k) {
    let total = 1;

    primeHelper.factorize(k, (p, e) => {
        total = total.modMul(FP(p, e), MODULO);
    });

    return total;
}

function G(n, trace) {
    let total = 0;

    const tracer = new Tracer(trace);

    for (let k = 1; k <= n; k++) {
        tracer.print(_ => n - k);
        total = (total + F(k)) % MODULO;
    }

    tracer.clear();

    return total;
}

assert.equal(G(10), 3053);
assert.equal(G(1E5), 157612967);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(1E7, true));
console.log(`Answer is ${answer}`);