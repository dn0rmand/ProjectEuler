// Let p(n) represent the number of different ways in which n coins can be separated into piles. 
// For example, five coins can be separated into piles in exactly seven different ways, so p(5)=7.
//
// OOO
// OO O
// O OO
// O O O

// OOOOO
// OOOO   O
// OOO   OO
// OOO   O   O
// OO   OO   O
// OO   O   O   O
// O   O   O   O   O
//
// Find the least value of n for which p(n) is divisible by one million.

const assert = require('assert');
const MILLION= 1000000;

const memoize = [];

function g(k)
{
    return ; 
}

function p(n)
{
    if (n < 0)
        return 0;
    if (n === 0)
        return 1;

    let count = memoize[n];
    if (count !== undefined)
        return count;

    count = 0;

    let K     = Math.sqrt(24*n + 1);
    let kStart= Math.round(-0.5 - ( K + 1 ) / 6);
    let kEnd  = Math.round( 0.5 + ( K - 1 ) / 6);

    for (let k = kStart; k <= kEnd; k++)
    {
        if (k === 0)
            continue;

        let gk   = k*(3*k-1)/2;
        let pp   = p(n-gk);
        let coef = Math.pow(-1, k-1);

        count = (count + (coef * pp)) % MILLION;         
    }

    memoize[n] = count;
    return count;
}

function P(n)
{
    let count = 0;

    function innerP(n, previous)
    {
        if (n === 0)
        {
            count++;
        }
        else
        {
            let start = Math.max(0, n-previous);

            for (let i = start; i < n; i++)
            {
                innerP(i, n-i);
            }
        }
    }

    innerP(n, n);

    return count;
}

assert.equal(p(5), 7);
assert.equal(p(10), 42);
assert.equal(p(14), 135);
console.log('------ TEST PASSED ------');

for (let i = 59; ; i++)
{
    let value = p(i);
    let modulo= value % MILLION;

    if (modulo === 0)
    {
        console.log('The least value of n for which p(n) is divisible by one million is ' + i);
        break;
    }    
}