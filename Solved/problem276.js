// Primitive Triangles
// -------------------
// Problem 276
// -----------
// Consider the triangles with integer sides a, b and c with a ≤ b ≤ c.
// An integer sided triangle (a,b,c) is called primitive if gcd(a,b,c)=1.
// How many primitive integer sided triangles exist with a perimeter not exceeding 10 000 000?

const MAX = 10000000;

const primeHelper = require('tools/primeHelper')(MAX);
const bigInt = require('big-integer');
const assert = require('assert');
const prettyHrtime = require("pretty-hrtime");

const allPrimes = primeHelper.allPrimes();

function factorize(n)
{
    if (n < 2)
        return [];

    if (primeHelper.isPrime(n))
        return [n];

    let primes = [];
    for (let p of allPrimes)
    {
        if (p > n)
            break;

        if (n % p === 0)
        {
            while (n % p === 0)
            {
                primes.push(p);
                n /= p;
            }
            if (n === 1)
                break;
            if (primeHelper.isPrime(n))
                break;
        }
    }

    if (n !== 1)
        primes.push(n);

    return primes;
}

function generate(maxValue, primes, callback)
{
    let visited = [];

    function inner(value, index)
    {
        for (let i = index; i < primes.length; i++)
        {
            let p = primes[i];
            let v = value * p;
            if (v >= maxValue)
                break;

            if (visited[v] === undefined)
            {
                callback(v);
                visited[v] = 1;
                inner(v, i+1);
            }
        }
    }

    inner(1, 0);
}

function solve(max)
{
    let total = 0;
    let extra = bigInt.zero;
    let cache = [];

    for (let p = 1; p <= max; p++)
    {
        let triangles;

        if ((p & 1) === 0) // even
        {
            triangles = Math.round((p*p) / 48);
        }
        else // odd
        {
            triangles = Math.round(((p+3)*(p+3)) / 48);
        }

        if (triangles > 0 && !primeHelper.isPrime(p))
        {
            let factors = factorize(p);

            generate(p, factors, (f) => {
                triangles -= cache[f];
            });
        }

        cache[p] = triangles;

        if (triangles > 0)
        {
            let t = total + triangles;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra = extra.plus(total).plus(triangles);
                total = 0;
            }
            else
                total = t;
        }
    }

    return extra.plus(total).toString();
}

assert.equal(solve(10000), 5779731138);

let start = process.hrtime();
let answer = solve(MAX);
let end = process.hrtime(start);

console.log("Answer is", answer, ", solved in", prettyHrtime(end, {verbose:true}));
