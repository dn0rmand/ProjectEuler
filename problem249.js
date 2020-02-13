const timeLogger  = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();
const assert      = require('assert');

const MAX_SUM   = 2000000;
const MAX       = 5000;
const MODULO    = 10n ** 16n;

primeHelper.initialize(MAX_SUM);

const allPrimes = primeHelper.allPrimes();

const MAX_PRIME = (() => {
    let total = 0;
    for(let p of allPrimes)
        if (p >= MAX)
            break;
        else
            total += p;
    return total;
})();

function solve(max, trace)
{
    const   states = new Map();
    let     count  = 0n;

    states.set(0, 1n);

    for(let p of allPrimes)
    {        
        if (p >= max)
            break;

        if (trace)
            process.stdout.write(`\r${p} : ${count} - ${states.size} `);

        const entries = [...states.entries()];
        for(let entry of entries)
        {
            const v = entry[0] + p;
            const c = entry[1];

            if (primeHelper.isKnownPrime(v))
                count = (count + c) % MODULO;

            const o = states.get(v) || 0n;
            states.set(v, (o + c) % MODULO);
        }
    }

    if (trace)
        console.log('');

    return count;
}

assert.equal(solve(100), 5253640);

const answer = timeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${ answer }`);