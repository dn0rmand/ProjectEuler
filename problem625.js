// Gcd sum
// Problem 625 

// G(N)= ∑j=1->N ∑i=1->j gcd(i,j)

// You are given: G(10)=122
// Find G(10^11). Give your answer modulo 998244353

const assert    = require('assert');
const prettyTime= require("pretty-hrtime");

const MODULO = 998244353;

const MAX  = Math.pow(10, 11);
const TEST = Math.pow(10, 8);

const _primeMap    = new Map();
let   _primes      = []
let   _maxPrime    = 3;

function isPrime(p)
{
    if (_primeMap.has(p))
        return true;
    if (p <= _maxPrime)
        return false;

    if ((p & 1)  === 0 || (p % 3) === 0)
        return false;
    let root = Math.floor(Math.sqrt(p));
    for(let i of _primes)
    {
        if (i > root)
            break;
        if (p % i === 0)
            return false;
    }
    return true;                        
}

function generatePrimes2() 
{
    _primeMap.set(2);
    _primeMap.set(3);
    _primes.push(2);
    _primes.push(3);

    let n = Math.ceil(Math.sqrt(MAX));

    for (let i = 5; i <= n; i += 2) 
    {
        if (isPrime(i))
        {
            _primeMap.set(i);
            _primes.push(i);
            _maxPrime    = i;
        }
    }
}

function generatePrimes(max) 
{
    _primeMap.set(2);
    _primeMap.set(3);
    _primes.push(2);
    _primes.push(3);

    let n = max || Math.ceil(Math.sqrt(MAX));
    
    let sieve = []; //new Int32Array(max / 31);

    for (let i = 2, j = 3; ; i+=2, j+=3)
    {
        if (i > n)
            break;
        sieve[i] = 0;
        if (j <= n)
            sieve[j] = 0;
    }

    for (let i = 5; i <= n; i += 2) 
    {
        if (sieve[i] === 0)
            continue;
        sieve[i] = 1;
        _primes.push(i);
        _primeMap.set(i);
        _maxPrime = i;

        for(let j = i+i; j <= n; j += i)
        {
            sieve[j] = 0;
        }
    }

    _maxPrime = n;
}

function g(n, e)
{
    if (e === 1)
        return n+n-1;

    if (e !== undefined)
    {
        //(p^(e−1)) * ((p−1)*e+p)

        let total = Math.pow(n, e-1) * (((n-1) * e) + n);

        return total;
    }
    else
    {
        let total = 1;

        let max = Math.floor(Math.sqrt(n));

        for (let p of _primes)
        {
            if (p > max)
                break;

            let power = 0;
            
            while ((n % p) === 0)
            {
                n /= p;
                power++;
            }

            if (power > 0)
            {
                total *= g(p, power);

                if (n === 1)
                    break;

                max = Math.floor(Math.sqrt(n));
            }
        }

        if (n > 1)
            total *= g(n, 1);

        return total;
    }
}

function G(N)
{
    let start = process.hrtime();
    
    let total = 1;

    for(let i = 2; i <= N; i++)
    {
        total = (total + g(i)) % 998244353;
    }

    let end = process.hrtime(start);
    
    console.log('G(' + N + ') = ' + total +' - Calculated in ' + prettyTime(end, {verbose:true}));
    return total;
}

// Prepare

console.log("initializing primes");
let start = process.hrtime();
generatePrimes(10000000);
let end = process.hrtime(start);
console.log('primes loaded in ' + prettyTime(end, {verbose:true}));

// console.log(MODULO);
// console.log(G(MODULO));

// Tests

assert.equal(G(10), 122);
assert.equal(G(1000), 2475190);
assert.equal(G(10000), 317257140);

// Remember last execution

// start = 4858174389; current Total = 501957719

let v2 = G(MAX);
console.log(v2);

console.log('done');