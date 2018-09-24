// Flexible digit sum
// ------------------
// Problem 637
// -----------
// Given any positive integer n, we can construct a new integer by inserting plus signs between some of the digits of
// the base B representation of n, and then carrying out the additions.

// For example, from n = 123(10) (n in base 10) we can construct the four base 10 integers 123(10), 1+23 = 24(10),
// 12+3=15(10) and 1+2+3=6(10)

// Let f(n,B) be the smallest number of steps needed to arrive at a single-digit number in base B.
// For example, f(7,10)=0 and f(123,10)=1

// Let g(n,B1,B2) be the sum of the positive integers i not exceeding n such that f(i,B1)=f(i,B2)

// You are given g(100,10,3)=3302

// Find g(1E7,10,3)

const assert = require('assert');
const MAX    = 1E7;

const _memoize10 = new Map();

function toDigits(n, B)
{
    if (n === 0)
        return [0];

    let digits = [];

    while (n > 0)
    {
        let d = n % B;
        n = (n-d) / B;
        digits.push(d);
    }
    digits = digits.reverse();
    return digits;
}

function getNumbers(digits, callback)
{
    if (digits.length === 1)
    {
        callback(digits[0]);
        return;
    }

    let bits = digits.length-1;
    let mask = (2 ** bits); // adding all digits already handled

    while (--mask > 0)
    {
        let total = 0;
        let value = digits[0];
        let m     = mask;

        for (let idx = 1; idx < digits.length; idx++)
        {
            if (m & 1 === 1)
            {
                total += value;
                value = digits[idx];
            }
            else
            {
                value = (value * 10) + digits[idx];
            }
            m = m >>> 1;
        }

        total += value;
        if (callback(total) === true)
            break;
    }
}

// got list from https://oeis.org/A253057
const exceptions = [
    1781, 3239, 3887, 11177, 14821, 33047, 41065, 43981, 98657, 131461, 393901
];

function f3(n)
{
    if (n < 3)
        return 0;
    if (exceptions.includes(n))
        return 3;
    let digits = toDigits(n, 3);
    let sum = digits.reduce((a, d) => a+d , 0);
    if (sum < 3)
        return 1;
    else
        return 2;
}

function f10(n)
{
    if (n < 10)
        return 0;

    let memoize = _memoize10;

    let result = memoize.get(n);
    if (result !== undefined)
        return result;

    let digits = toDigits(n, 10);
    let sum = digits.reduce((a, d) => a+d , 0);
    if (sum < 10)
        return 1;

    let minSteps = 4;
    getNumbers(digits, (v) =>
    {
        let steps = f10(v);

        if (steps < minSteps)
        {
            minSteps = steps;
            if (steps < 2) // cannot do better than that!!!
                return true; // tell getNumber to stop
        }
    });

    memoize.set(n, minSteps+1);

    return minSteps+1;
}

function g(n)
{
    let total = 0;

    for (let i = 1; i <= n; i++)
    {
        let f1 = f10(i);
        let f2 = f3(i);

        if (f1 === f2)
            total += i;
    }

    return total;
}

console.log("Running tests");

assert.equal(f10(7), 0);
assert.equal(f10(123), 1);
assert.equal(g(100), 3302);

console.log("Solving");

console.time(637);
let answer = g(MAX);
console.timeEnd(637);

console.log('Answer is', answer);
