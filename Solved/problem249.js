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
    const   states   = new Array(MAX_PRIME+1).fill(0n);
    let     count    = 0n;
    let     maxValue = 0;

    states[0] = 1n;

    for(let p of allPrimes)
    {        
        if (p >= max)
            break;

        if (trace)
            process.stdout.write(`\r${p} : ${count}`);

        const maxVal = maxValue;
        
        for(let value = maxValue; value >= 0; value--)
        {
            const c = states[value];
            if (c === 0n)
                continue;

            const v = value + p;
            if (v > MAX_PRIME)
                continue;
            if (v > maxValue)
                maxValue = v;

            if (primeHelper.isKnownPrime(v))
                count = (count + c) % MODULO;

            states[v] = (states[v] + c) % MODULO;
        }
    }

    if (trace)
        console.log('');

    return count;
}

assert.equal(solve(100), 5253640);

const answer = timeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${ answer }`);