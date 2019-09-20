// Sum of Squares
// --------------
// Problem 273
// Consider equations of the form: a2 + b2 = N, 0 ≤ a ≤ b, a, b and N integer.
//
// For N=65 there are two solutions:
//
// a=1, b=8 and a=4, b=7.
//
// We call S(N) the sum of the values of a of all solutions of a2 + b2 = N, 0 ≤ a ≤ b, a, b and N integer.
//
// Thus S(65) = 1 + 4 = 5.
//
// Find ∑ S(N), for all squarefree N only divisible by primes of the form 4k+1 with 4k+1 < 150.

const assert = require('assert');
const primeHelper = require('tools/primeHelper')(150);
const timerLog = require('tools/timeLogger');

const allPrimes = primeHelper.allPrimes().filter((p) => { return (p % 4)===1; });

function generateNumbers(callback)
{
    let usedPrimes = [];

    function inner(index)
    {
        if (index > 0)
            callback(usedPrimes);

        for (let i = index; i < allPrimes.length; i++)
        {
            usedPrimes.push(allPrimes[i]);
            inner(i+1);
            usedPrimes.pop();
        }
    }

    inner(0);
}

function force(n)
{
    let result = undefined;
    for (let a = 0; ; a++)
    {
        let A = a*a;
        let B = n-A;
        if (B < A) break;
        let b = Math.round(Math.sqrt(B));
        if (b*b === B)
        {
            if (result !== undefined)
                throw "ERROR";
            result = {a: a, b: b};
        }
    }
    return result;
}

function getABS()
{
    let abs = [];

    for (let p of allPrimes)
    {
        abs[p] = force(p);
    }

    return abs;
}

const primeABS = getABS();

function merge1(ab1, ab2)
{
    let a = (ab1.a * ab2.a) + (ab1.b*ab2.b);
    let b = (ab1.a * ab2.b) - (ab1.b*ab2.a);

    if (b < 0)
        b = -b;
    if (b < a)
        return {a: b, b: a};
    else
        return {a: a, b: b};
}

function merge2(ab1, ab2)
{
    let a = (ab1.b * ab2.a) + (ab1.a*ab2.b);
    let b = (ab1.b * ab2.b) - (ab1.a*ab2.a);

    if (b < 0)
        b = -b;
    if (b < a)
        return {a: b, b: a};
    else
        return {a: a, b: b};
}

function getAS(primes)
{
    let results = new Set();
    let processed = new Set();
    let used    = [];

    function makeKey(ab)
    {
        let key = `${ab.a}:${ab.b}`;
        for (let i = 0; i < primes.length; i++)
        {
            if (! used[i])
                key += `:${primes[i]}`;
        }
        return key;
    }

    function inner(current, count)
    {
        if (count === primes.length)
        {
            if (results.has(current.a))
                return;
            results.add(current.a);
            return;
        }
        let key = makeKey(current);
        if (processed.has(key))
            return;

        processed.add(key);

        for (let i = 0; i < primes.length; i++)
        {
            if (used[i]) continue;
            used[i] = 1;
            var c = merge1(current, primeABS[primes[i]]);
            inner(c, count+1);
            c = merge2(current, primeABS[primes[i]]);
            inner(c, count+1);
            used[i] = 0;
        }
    }

    for (let i = 0; i < primes.length; i++)
    {
        used[i] = 1;
        inner(primeABS[primes[i]], 1);
        used[i] = 0;
    }

    return results;
}

function Sum(primes)
{
    let total = 0n;
    for (let a of getAS(primes))
        total += BigInt(a);

    return total;
}

function S(n)
{
    var primes = [];
    primeHelper.factorize(n, (p, f) => {
        if ((p % 4) !== 1 || f !== 1)
            throw "ERROR";

        primes.push(p);
    })
    return Sum(primes);
}

function solve()
{
    let total = 0n;
    let numberCount = 65536
    generateNumbers((primes) => {
        numberCount--;
        process.stdout.write(`\r${numberCount} - ${primes.length}             `);
        total += Sum(primes);
    });
    process.stdout.write(`\r                                      \r`);
    return total;
}

function Analyze()
{
    function verify(n)
    {
        let result = 0;
        for (let a = 0; ; a++)
        {
            let A = a*a;
            let B = n-A;
            if (B < A) break;
            let b = Math.round(Math.sqrt(B));
            if (b*b === B)
            {
                result += a;
            }
        }

        console.log(`S(${n}) = ${result}`);

        let value = S(n);
        assert.equal(value, result);
    }

    verify(65);
    verify(32045);
    verify(40885);
    verify(215826649);
}

// Analyze();

assert.equal(S(65), 5);

let answer = timerLog.wrap('', () => {
    return solve();
});

console.log('Answer is', answer);
