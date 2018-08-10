// Squarefree Numbers
// ------------------
// Problem 193 
// -----------
// A positive integer n is called squarefree, if no square of a prime divides n, 
// thus 1, 2, 3, 5, 6, 7, 10, 11 are squarefree, but not 4, 8, 9, 12.
// How many squarefree numbers are there below 2^50?

const primeHelper = require('tools/primeHelper.js')();

let MAX = Math.pow(2, 50);
let MAX_ROOT = Math.pow(2, 25);

primeHelper.initialize(MAX_ROOT);

let memoize = [];

function mobius(n)
{
    if (n === 1)
        return 1;
    let result = memoize[n];
    if (result !== undefined)
        return result;

    if (primeHelper.isPrime(n))
    {
        memoize[n] = -1
        return -1;
    }

    let v = n;

    for (let p of primeHelper.primes())
    {
        if (p > v)
            break;
        if (v % p === 0)
        {
            v /= p;
            if (v % p === 0)
            {
                memoize[n] = 0;
                return 0;
            }
            break;
        }
    }

    if (v > 1)     
        result = -mobius(v);
    else
        result = -1;

    memoize[n] = result;
    return result;
}

function solve()
{
    let count = 0;

    for (let n = 1; n <= MAX_ROOT; n++)
    {
        let m = mobius(n);
        if (m !== 0)
        {
            let f = Math.floor(MAX / (n*n));
            count += f*m;
        }
    }
    return count;
}

let answer = solve();

console.log('Answer to problem 193 is ', answer);
