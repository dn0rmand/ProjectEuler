const assert = require('assert');
const divisors = require('tools/divisors');
const primeHelper = require('tools/primeHelper')();
const timeLog = require('tools/timeLogger');

const MAX = 1E8;

timeLog("Loading primes",() => { primeHelper.initialize(MAX); });

function gcd(a, b)
{
    while (b !== 0)
    {
        let c = a % b;
        a = b;
        b = c;
    }
    return a;
}

function divisorSum(n)
{
    let total = 0;

    divisors(n, primeHelper.isKnownPrime, (d) =>
    {
        total += d;
    });

    return total;
}

function otherDivisorSum(n)
{
    let total = 0;
    let max = Math.floor(Math.sqrt(n))+1;

    for (let b = 1; b <= max; b++)
    {
        let b2 = b*b;
        for (let a = 1; ; a++)
        {
            if (gcd(a, b) !== 1)
                continue;

            let ab = a*a + b2;
            if (ab > n)
                break;
            if (n % ab === 0)
            {
                let v = (n / ab);
                let t = v*(v+1)*a;
                total += t;
            }
        }
    }

    return total;
}

function solve(n)
{
    let total = 0;
    for (let i = n; i > 0; i--)
    {
        let v1 = divisorSum(i);
        let v2 = 0;//otherDivisorSum(i);

        total += (v1+v2);
    }
    return total;
}

timeLog("Testing", () => {
// assert.equal(solve(5), 35);
// assert.equal(solve(100000), 17924657155);
});

let answer = timeLog("Solving", () => {
    return solve(1E7);
});
console.log(`Answer is ${answer}`);
