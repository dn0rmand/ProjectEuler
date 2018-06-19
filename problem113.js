// Non-bouncy numbers
// ------------------
// Problem 113 
// -----------
// Working from left-to-right if no digit is exceeded by the digit to its left it is called an increasing number; 
// for example, 134468.

// Similarly if no digit is exceeded by the digit to its right it is called a decreasing number; for example, 66420.

// We shall call a positive integer that is neither increasing nor decreasing a "bouncy" number; for example, 155349.

// As n increases, the proportion of bouncy numbers below n increases such that there are only 12951 numbers 
// below one-million that are not bouncy and only 277032 non-bouncy numbers below 10^10.

// How many numbers below a googol (10^100) are not bouncy?

const assert = require('assert');

function generateDown(length)
{
    let memoize = [];

    function get(digit, length)
    {
        let k = (length * 10) + digit;
        return memoize[k];
    }

    function set(digit, length, value)
    {
        let k = (length * 10) + digit;
        memoize[k] = value;
    }
    
    function inner(digit, length)
    {
        if (length === 0)
        {
            return 1;
        }

        let count = get(digit, length);
        if (count !== undefined)
            return count;

        count = 0;

        for (let d = digit; d >= 0; d--)
        {
            count += inner(d, length-1);
        }

        set(digit, length, count);
        return count;
    }

    let total = 0;

    for (let l = 2; l <= length; l++)
    {
        for (let d = 9; d > 0; d--)
        {
            total += (inner(d, l-1) - 1); // -1 to exclude all same digits
        }
    }
    
    return total;
}

function generateUp(length)
{
    let memoize = [];

    function get(digit, length)
    {
        let k = (length * 10) + digit;
        return memoize[k];
    }

    function set(digit, length, value)
    {
        let k = (length * 10) + digit;
        memoize[k] = value;
    }
        
    function inner(digit, length)
    {
        if (length === 0)
        {
            return 1;
        }

        let count = get(digit, length);
        if (count !== undefined)
            return count;

        count = 0;
        
        for (let d = digit; d < 10; d++)
        {
            count += inner(d, length-1);
        }

        set(digit, length, count);

        return count;
    }

    let total = 0;
    for (let d = 0; d < 10; d++)
    {
        total += inner(d, length-1);
    }

    return total;
}


function solve(length)
{
    let v1 = generateDown(length);
    let v2 = generateUp(length);

    return v1 + v2 - 1;
}

assert.equal(solve(6), 12951);

let answer = solve(100);
console.log("Answer to problem 113 is", answer);
