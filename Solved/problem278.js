const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MAX = 5000;

primeHelper.initialize(MAX, true);

const f = (p, q, r) => 2*p*q*r - p*q - p*r - q*r;
const f2 = (p, q, r) => {
    const pq = p*q;
    const pr = p*r;
    const qr = q*r;

    return (pq.lcm(pr) + pq.lcm(qr)) - pq - pr - qr;
}

function solve()
{
    const allPrimes = primeHelper.allPrimes();

    let total = 0;
    let extra = 0n;

    for(let pi = 0; pi < allPrimes.length; pi++) {
        const p = allPrimes[pi];
        for(let qi = pi+1; qi < allPrimes.length; qi++) {
            const q = allPrimes[qi];
            for (let ri = qi+1; ri < allPrimes.length; ri++) {
                const r = allPrimes[ri];
                const m = f(p, q, r);         
                
                const t = total + m;
                if (t > Number.MAX_SAFE_INTEGER) {
                    extra += BigInt(total) + BigInt(m);
                    total = 0;
                } else {
                    total = t;
                }
            }
        }
    }
    return BigInt(total) + extra;
}

assert.strictEqual(f(2, 3, 5), 29);
assert.strictEqual(f(2, 7, 11), 195);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);