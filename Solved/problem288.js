const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MODULO_1 = 3n ** 20n;
const MODULO_2 = 61n ** 10n;

const $factors = new Map();

function countFactors(value, prime, modulo)
{
    let result = $factors.get(value);
    if (result !== undefined)
        return result;

    result = 0n;
    for (let power = prime; power <= value; power *= prime)
    {
        const c = value / power;
        result = (result + (c % modulo)) % modulo;
    }

    $factors.set(value, result);
    return result
}

function N(p, q, modulo, callback)
{
    let S0    = 290797n;
    let pp    = 1n;

    let traceCount = 0;

    for(let n = 0n; n <= q; n++)
    {
        if (p === 61n)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${q-n} `);
            if (traceCount++ >= 10000)
                traceCount = 0;
        }

        const T = S0 % p;

        callback(pp * T);

        S0 = (S0*S0) % 50515093n;

        if (pp < modulo)
            pp *= p;
    }
    
    if (p === 61n)
        process.stdout.write("\r    \r");
}

function solve(p, q, modulo)
{
    p = BigInt(p);
    q = BigInt(q);

    $factors.clear();

    let factors = 0n;

    N(p, q, modulo, (value) => {
        factors = (factors + countFactors(value, p, modulo)) % modulo;
    });

    return factors;
}

assert.equal(solve(3, 10000, MODULO_1), 624955285);
console.log("Test passed");

const answer = timeLogger.wrap('', () => solve(61, 10000000, MODULO_2));
console.log(`Answer is ${answer}`);