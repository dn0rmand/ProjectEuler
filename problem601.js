// Divisibility streaks
// --------------------
// Problem 601 
// -----------
// For every positive number n we define the function streak(n)=k as the smallest positive integer k such that 
// n+k is not divisible by k+1.

// E.g:
//     13 is divisible by 1 
//     14 is divisible by 2 
//     15 is divisible by 3 
//     16 is divisible by 4 
//     17 is NOT divisible by 5 
// So streak(13)=4.

// Similarly:
//     120 is divisible by 1 
//     121 is NOT divisible by 2 
// So streak(120)=1.

// Define P(s,N) to be the number of integers n, 1<n<N, for which streak(n)=s

// So P(3,14)=1 and P(6,10^6)=14286.

// Find the sum, as i ranges from 1 to 31, of P(i,4^i).

const assert = require('assert');
const bigInt = require('big-integer');
const mclm   = require('mlcm');

function streak(n, max)
{
    for(let k = 1; k < max; k++)
    {
        if ((n+k) % (k+1) !== 0)
            return k;
    }

    return max;
}

function P(s, N)
{
    let vs = [];
    for (let i = 1; i <= s; i++) vs.push(i);
    let lcm1 = mclm(vs);
    vs.push(s+1);
    let lcm2 = mclm(vs);

    let n  = N.minus(2);
    let v1 = n.divide(lcm1);
    let v2 = n.divide(lcm2);
    let v  = v1.minus(v2);
    
    return v.valueOf();
}

function solve(max)
{
    let total = 0;
    for(let i = 1; i < max; i++)
    {
        let N = bigInt(4).pow(i);
        total += P(i, N);
    }

    return total;
}

//assert.equal(P(3, 14), 1);
assert.equal(P(6, bigInt(1000000)), 14286);

let answer = solve(32);
console.log("The sum, as i ranges from 1 to 31, of P(i,4^i) is", answer);