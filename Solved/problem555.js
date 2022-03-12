const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const divisors = require('tools/divisors');

const MAX = 1E6;

const M = (m, k, s) => n => {
    const diff = k-s;
    const kk = Math.ceil((m-n+1) / diff) * diff;
    const r = n + kk - s;
    return r;
};

const SF = (m, k, s) => {
    const d = k-s;
    if (s % d !== 0) {
        return 0;
    }
    
    return (m-s+1)*d + ((d-1)*d)/2;
}

function S(p, m, trace)
{
    const tracer = new Tracer(1, trace);
    let total = 0;
    let extra = 0n;

    for(let s = 1; s < p; s++) {
        tracer.print(_ => p-s);
        let subTotal = 0;
        const A = m-s+1;
        for (const d of [...divisors(s)].sort((a, b) => a-b)) {
            const k = s+d;
            if (k > p) {
                break;
            }
            if (d & 1) {
                subTotal += (A + (d-1) / 2) * d;
            } else {
                subTotal += A * d + (d-1)*(d/2);
            }
        }
        const t = total + subTotal;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra += BigInt(total) + BigInt(subTotal);
            total  = 0;
        } else {
            total = t;
        }
    }
    tracer.clear();
    if (extra) {
        return BigInt(total) + extra;
    }
    return total;
}

const M91 = M(100, 11, 10);

timeLogger.wrap('Testing', _ => {
    assert.strictEqual(M91(91), 91);
    assert.strictEqual(SF(100, 11, 10), 91);
    assert.strictEqual(S(10, 10), 225);
    assert.strictEqual(S(1000, 1000, true), 208724467);
});

console.log('Test passed');

const answer = timeLogger.wrap('Solving', _ => S(MAX, MAX, true));
console.log(`Answer is ${answer}`);