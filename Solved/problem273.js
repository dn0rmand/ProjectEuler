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

function mult1(a1, a2)
{
    let a = (a1.a * a2.a) - (a1.b * a2.b);
    let b = (a1.a * a2.b) + (a1.b * a2.a);

    return {a: a, b: b};
}

function mult2(a1, a2)
{
    let a = (a1.a * a2.a) + (a1.b * a2.b);
    let b = (a1.b * a2.a) - (a1.a * a2.b);

    return {a: a, b: b};
}

function Sum(primes)
{
    let total = 0n;

    function inner(current, index)
    {
        if (index >= primes.length)
        {
            let a = Math.min(Math.abs(current.a), Math.abs(current.b));
            total += BigInt(a);
            return;
        }
        let pa = primeABS[primes[index]];
        let c1 = mult1(current, pa);
        let c2 = mult2(current, pa);
        inner(c1, index+1);
        inner(c2, index+1);
    }

    let pa = primeABS[primes[0]];
    inner(pa, 1);

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
    generateNumbers((primes) => {
        total += Sum(primes);
    });
    return total;
}

assert.equal(S(65), 5);

let answer = timerLog.wrap('', () => {
    return solve();
});

console.log(`Answer is ${answer}`);
