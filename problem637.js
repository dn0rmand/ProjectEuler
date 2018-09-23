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

const bigInt = require('big-integer');
const assert = require('assert');

const memoize3  = [];
const memoize10 = [];

function f3(n)
{
    function toDigits(n)
    {
        if (n === 0)
            return [0];
    
        let digits = [];
    
        while (n > 0)
        {
            let d = n % 3;
            n = (n-d) / 3;
            digits.push(d);
        }
        digits = digits.reverse();
        return digits;
    }
    
    if (n < 3)
        return 0;

    let result = memoize3[n];
    if (result !== undefined)
        return result;

    let digits = toDigits(n);

    function *getNumbers(index)
    {
        if (index >= digits.length)
        {
            yield 0;
            return;
        }
        else if (index == digits.length-1)
        {
            yield digits[index];
            return;
        }
        else if (index == digits.length-2)
        {
            yield digits[index] + digits[index+1];
            yield digits[index]*3 + digits[index+1];
            return;
        }

        let prefix = 0;
        for (let i = index; i < digits.length; i++)
        {
            prefix = (prefix * 3) + digits[i];

            for (let v of getNumbers(i+1))
            {
                yield prefix + v;
            }
        }
    }

    let visited = new Set();
    let minSteps= Number.MAX_SAFE_INTEGER;

    visited.add(n);

    for (let v of getNumbers(0))
    {
        if (visited.has(v))
            continue;

        visited.add(v);

        let steps = f3(v);
        if (steps < minSteps)
        {
            minSteps = steps;
            if (steps === 0) // cannot do better than that!!!
                break;
        }
    }

    memoize3[n] = minSteps+1;

    return minSteps+1;
}

function f10(n)
{
    if (n < 10)
        return 0;

    let result = memoize10[n];
    if (result !== undefined)
        return result;

    let v = 0;
    for (let i = n; i > 0;)
    {
        let d = i % 10;
        i = (i-d) / 10;

        v += d;
    }

    result = 1 + f10(v, 10);
    memoize10[n] = result;

    return result;
}

function g(n, progress)
{
    let total = 0;
    let extra = bigInt.zero;

    let percent = "";
    let count   = 0;

    for (let i = 1; i <= n; i++)
    {
        let f1 = f10(i);
        let f2 = f3(i);

        if(f1 === f2)
        {
            let t = total + i;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra = extra.plus(total).plus(i);
                total = 0;
            }
            else
                total = t;
        }

        if (progress && count === 0)
        {
            let p = (((n-i)*100) / n).toFixed(0);
            if (p !== percent)
            {
                percent = p;
                console.log(p);
            }
        }

        if (++count > 1000)
            count = 0;
    }

    return extra.plus(total).toString();
}

assert.equal(f10(7,10), 0);
assert.equal(f10(123,10), 1);

assert.equal(g(100), "3302");

let answer = g(1E7, true);

console.log('Answer is', answer);
