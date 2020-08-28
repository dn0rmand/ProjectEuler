const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1E8;
const MAX_PRIME = 1E8;

timeLogger.wrap('Loading primes up to 1E8', _ => primeHelper.initialize(MAX_PRIME));

function countAntichains_inner(factors, index, sum, half)
{
    if (index >= factors.length)
        return 0;

    if (sum < half)
        return 0;

    if (half === 0 || index === factors.length-1)
        return 1;

    let result = 0;
    for (let i = 0; i <= factors[index] && i <= half; i++)
        result += countAntichains_inner(factors, index+1, sum - factors[index], half - i);

    return result;
}

const $countAntichains = new Map();

function countAntichains(factors)
{
    let result;

    const key = factors.join(':');
    result = $countAntichains.get(key);
    if (result !== undefined)
        return result;

    const sum = factors.reduce((a, v) => a+v);

    result = countAntichains_inner(factors, 0, sum, Math.floor(sum / 2));
    $countAntichains.set(key, result);
    return result;
}

const $N = new Map();
const MAXFACTOR = 26;

function N2(factors)
{
    if (factors.length === 0)
        return 1;

    factors = factors.slice().sort((a, b) => a-b);

    const k = factors.reduce((a, v) => a*MAXFACTOR + v, 0);

    let result = $N.get(k);
    if (result === undefined)
    {
        result = countAntichains(factors);
        $N.set(k, result);
    }
    return result; 
}

function N(n)
{
    const factors = [];
    primeHelper.factorize(n, (p, f) => {
        factors.push(f);
    });

    return N2(factors);
}

const allPrimes = primeHelper.allPrimes();

function innerGenerateNumbers(value, index, factors, max, callback)
{
    if (value > max)
        return;

    callback(factors);

    for(let i = index; i < allPrimes.length; i++)
    {
        const p = allPrimes[i];

        let v = value * p;
        if (v > max)
            break;

        const idx = factors.length;
        factors.push(1);
        while (v <= max)
        {
            innerGenerateNumbers(v, i+1, factors, max, callback);

            factors[idx]++;
            v *= p;
        }
        factors.pop();
    }
}

function generateNumbers(max, callback)
{
    innerGenerateNumbers(1, 0, [], max, callback);
}

function solve(max, trace)
{
    let total = 0;
    let count = max;

    const tracer = new Tracer(100000, trace);
    generateNumbers(max, factors => {
        count--;
        tracer.print(_ => count);
        total += N2(factors);
    });
    tracer.clear();
    return total;
}

assert.equal(N(30), 3);
assert.equal(solve(1E4), 29860);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
