// Gcd sum
// Problem 625 

// G(N)= ∑j=1->N ∑i=1->j gcd(i,j)

// You are given: G(10)=122
// Find G(10^11). Give your answer modulo 998244353

const assert    = require('assert');
const bigInt    = require('big-integer');
const prettyTime= require("pretty-hrtime");
const isPrime   = require('./tools/isPrime.js');
const totient   = require('./tools/totient.js');
const divisors  = require('./tools/divisors.js');

const MODULO = 998244353;

const MAX  = Math.pow(10, 11);
const TEST = 200000000;

let memoize = new Map();

function g(N, useTotient)
{
    let n = N;
    let result = memoize.get(n);

    if (result !== undefined)
        return result;

    if (totient.isPrime(n))
    {
        memoize.set(n , n+n-1);
        return n + n - 1;
    }

    let total = 0;

    if (useTotient === true)
    {
        // Set New Max
        totient.initialize(n);
        for(let d of divisors(n))
        {
            let phi = totient.PHI(n / d);
            total += phi * d;
        }
        memoize.set(n, total);
    }
    else
    {
        for (let p of totient.primes())
        {
            if (p > n)
                break;

            let power = 1;
            
            while ((n % p) === 0)
            {
                n /= p;
                power *= p;
            }

            if (power > 1)
            {
                let v = g(power, true);

                if (total === 0)
                    total = v;
                else
                    total *= v;
            }
            if (n === 1)
                break;
        }

        if (n > 1)
        {
            // Total shouldn't be 0 or n would be prime
            total *= g(n);
        }
    }

    return total;
}

let _gMax = 0;
let _gMaxValue = 0;

function G(N)
{
    let total = 1;
    let start = 2;
    if (_gMax > 0 && _gMax <= N)
    {
        total = _gMaxValue;
        if (_gMax === N)
            return total;

        start = _gMax+1;
    }

    for(let i = start; i <= N; i++)
    {
        total = (total + g(i)) % 998244353;
    }
    _gMax = N;
    _gMaxValue = total;
    return total;
}

function speedTest(max)
{
    let start = process.hrtime();
    let last = 0;
    for (let i = /*_gMax+*/1; i <= max ; i++)
    for (let d of divisors(i))
    {
        last = d;
    }
    let end = process.hrtime(start);
    console.log('lopped divisors up to ' + max + " executed in " + prettyTime(end, {verbose:true}));
}

// Prepare

let maxPrime = Math.ceil(Math.sqrt(MAX));
console.log("initializing totient primes");
let start = process.hrtime();
totient.initialize(maxPrime); // Max prime needed for iterating
let end = process.hrtime(start);
console.log('totient.initialize(' + maxPrime + ") executed in " + prettyTime(end, {verbose:true}));

// Tests

assert.equal(G(10), 122);
assert.equal(G(1000), 2475190);
assert.equal(G(10000), 317257140);

// Remember last execution

// _gMax = 200000000; _gMaxValue = 613187659; // 247283132184682720;


// Do it 
let v1 = G(TEST);
console.log("_gMax = " + TEST + "; _gMaxValue = " + v1.toString() + ";");

// let v2 = G(MAX);
// console.log(v2);

console.log('done');