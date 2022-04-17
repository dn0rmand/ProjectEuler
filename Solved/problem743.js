const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1000000007
const MAX = 10n ** 16n;
const MAX_K = 1E8;

const TWO = 2;

const SPEED = 50000;

const $factorial = timeLogger.wrap('Loading factorials', _ => {
    const ONE = 1;
    const f = new Uint32Array(MAX_K+1);

    f[0] = f[1] = ONE;

    const tracer = new Tracer(SPEED, true);
    for(let i = 2; i <= MAX_K; i++) 
    {
        tracer.print(_ => MAX_K-i);
        f[i] = f[i-1].modMul(i, MODULO);
    }
    tracer.clear();
    return f;
});

function A(k, n, trace)
{
    const getPossibleWindows = (sum, ones) =>
    {
        const remaining = sum - ones;
        const twos  = remaining / 2;
        const zeros = sum - ones - twos;
        const top = $factorial[sum];
        const bottom = $factorial[zeros].modMul($factorial[ones].modMul($factorial[twos], MODULO), MODULO);
    
        return top.modDiv(bottom, MODULO);
    }

    const ratio = Number((BigInt(n)-BigInt(k)) / BigInt(k));

    let POW2  = TWO.modPow(ratio+1, MODULO);

    const tracer = new Tracer(SPEED, trace);
    const start = k & 1 ? 1 : 0;

    let pow2 = POW2.modPow(start, MODULO);

    POW2 = POW2.modMul(POW2, MODULO);

    let total = 0;

    for(let ones = start; ones <= k; ones += 2) {
        tracer.print(_ => k - ones);

        let count = getPossibleWindows(k, ones);
        if (count === 0)
            continue;

        const v = pow2.modMul(count, MODULO);

        total = (total + v) % MODULO;

        pow2 = pow2.modMul(POW2, MODULO);
    }

    tracer.clear();

    return total;
}

assert.strictEqual(A(3, 9), 560);
assert.strictEqual(A(4, 20), 1060870);

assert.strictEqual(A(8, 1E8), 34361002);
assert.strictEqual(A(8, 1E9), 176222383);
assert.strictEqual(A(8, MAX), 637480935);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => A(MAX_K, MAX, true));

console.log(`Answer is ${answer}`);
