const assert = require('assert');
const divisors = require('tools/divisors');
const primeHelper = require('tools/primeHelper')();
const TimeLogger = require('tools/timeLogger');
const prettyHrtime = require('atlas-pretty-hrtime');

const MAX = 1E6;

function timeLog(message, action)
{
    var logger = new TimeLogger(message);
    logger.start();
    try
    {
        return action();
    }
    catch(e)
    {
        logger.stop();
        throw e;
    }
    finally
    {
        logger.stop();
    }
}

const $gcd = [];

function gcd(a, b)
{
    if (a === b)
        return a;

    if (a < b)
        [a, b] = [b, a];

    let x = $gcd[a];
    if (x === undefined)
        x = $gcd[a] = [];
    if (x[b] !== undefined)
        return x[b];

    let B = b; // Save B value

    while (b !== 0)
    {
        let c = a % b;
        a = b;
        b = c;
    }
    x[B] = a;
    return a;
}

const $squares       = [];
const $squaresMap    = new Map();
const $otherDivisors = new Int32Array(MAX+1);

$otherDivisors.fill(-1);

function preloadSquares()
{
    for (let i = 1; ; i++)
    {
        let b = i*i;
        if (b > MAX) break;
        for (let a of $squares)
        {
            if (a+b > MAX)
                break;
            if (gcd(a, b) === 1)
            {
                let coprimes = $squaresMap.get(a);
                if (coprimes === undefined)
                {
                    coprimes = [b];
                    $squaresMap.set(a, coprimes);
                }
                else
                    coprimes.push(b);
            }
        }

        $squares.push(b);
    }
}

function otherDivisors(d)
{
    let total = $otherDivisors[d];

    if (total >= 0)
        return total;

    total = 0;

    let a = 0;
    for (let a2 of $squares)
    {
        a++;

        for (let b = a+1; ; b++)
        {
            let b2 = $squares[b-1];
            let ab = b2 + a2;
            if (ab > d)
                break;

            if ((d % ab) === 0)
            {
                if (gcd(a, b) !== 1)
                    continue;

                let k = d / ab;
                total += 2*k*a;
                if (a !== b)
                    total += 2*k*b; // add the ones with a and b switched
            }
        }
    }

    $otherDivisors[d] = total;

    return total;
}

function preload(n, trace)
{
    preloadSquares();

    // preloading otherDivisors
    let count = 0;
    if (trace)
        TimeLogger.log('..tracing on\r\n');

    for (let i = n; i > 0; i--)
    {
        if (trace)
        {
            if (count-- === 0)
            {
                TimeLogger.log(`\r${ i } `);
                count = 999;
            }
        }
        otherDivisors(i);
    }

    if (trace)
        TimeLogger.log('\r');
}

function solve(n, trace)
{
    let total = 0;
    let count = 0;
    if (trace)
        TimeLogger.log('..tracing on\r\n');

    for (let i = n; i > 0; i--)
    {
        if (trace)
        {
            if (count-- === 0)
            {
                TimeLogger.log(`\r${ i } `);
                count = 999;
            }
        }
        divisors(i, primeHelper.isKnownPrime, (d) => {
            total += d;
            total += otherDivisors(d);
        });
    }
    if (trace)
        TimeLogger.log('\r');

    return total;
}

timeLog("Loading primes",() => { primeHelper.initialize(MAX); });

timeLog("Preloading", () => {
    preload(MAX, true);
});

timeLog("Running Tests", () => {
    assert.equal(solve(5), 35);
    assert.equal(solve(1E5), 17924657155);
});

let answer = timeLog("Solving", () => {
    return solve(MAX, true);
});
console.log(`Answer is ${answer}`);
