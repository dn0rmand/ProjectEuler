// Prime pair connection
// ---------------------
// Problem 134
//
// Consider the consecutive primes p1 = 19 and p2 = 23. It can be verified that 1219 is the smallest number such that
// the last digits are formed by p1 whilst also being divisible by p2.
//
// In fact, with the exception of p1 = 3 and p2 = 5, for every pair of consecutive primes, p2 > p1,
// there exist values of n for which the last digits are formed by p1 and n is divisible by p2.
// Let S be the smallest of these values of n.
//
// Find ∑ S for every pair of consecutive primes with 5 ≤ p1 ≤ 1000000.

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const prettyTime = require('pretty-hrtime');

const MAX = 1000000;

primeHelper.initialize(MAX + 10, true);

function getMask(value)
{
    let m = 1;
    while (value > 0)
    {
        m *= 10;
        value = (value - (value % 10)) / 10;
    }
    return m;
}

function S(p1, p2)
{
    let mask  = getMask(p1);

    let times = 0;
    while(true)
    {
        times += mask;
        let value = times + p1;

        if (value % p2 === 0)
            return value;
    }
}

function solve()
{
    let total = 0;
    let extra = 0n;

    let previous = -1;
    let count    = 0;

    for (let p of primeHelper.allPrimes())
    {
        if (previous >= 5 && previous <= MAX)
        {
            let value = S(previous, p);

            let t = total + value;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra += BigInt(total) + BigInt(value);
                total  = 0;
            }
            else
                total = t;

            if (count-- === 0)
            {
                process.stdout.write(`\r${previous}`);
                count = 100;
            }
        }

        if (p > MAX)
            break;

        previous = p;
    }
    process.stdout.write("\r           \r");

    return extra + BigInt(total);
}

assert.equal(S(19, 23), 1219);

let timer = process.hrtime();
let answer = solve();
timer = process.hrtime(timer);
console.log(`Answer is ${ answer } calculated in ${ prettyTime(timer, {verbose:true}) }`);
