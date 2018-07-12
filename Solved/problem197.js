// Investigating the behaviour of a recursively defined sequence
// -------------------------------------------------------------
// Problem 197 
// -----------
// Given is the function f(x) = ⌊2^(30.403243784-x^2)⌋ × 10^-9 ( ⌊ ⌋ is the floor-function),
// the sequence un is defined by u0 = -1 and un+1 = f(un).

// Find un + un+1 for n = 10^12.
// Give your answer with 9 digits after the decimal point.

const assert = require('assert');

function F(x)
{
    let x2    = x*x;
    let power = 30.403243784-x2;

    let result = Math.floor(Math.pow(2, power)) / 1000000000;

    return result;
}

function U(n, previous)
{
    if (n === 0)
        return -1;

    result = F(previous);
    return result;
}

let previous = -1;
let map = new Map();
let answer1 = 0;
let answer2 = 0;

for (let n = 0; n < 1000; n++)
{
    previous = U(n, previous);
    if (n === 520)
        answer1 = previous;
    else if (n === 521)
        answer2 = previous;

    if (n > 520 && n % 10 === 0)
        assert.equal(previous, answer1);
    if (n > 520 && n % 10 === 1)
        assert.equal(previous, answer2);
}

console.log('Answer to problem 197 is', (answer1+answer2).toFixed(9));
console.log('done');