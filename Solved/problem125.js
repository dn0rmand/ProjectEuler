// Palindromic sums
// ----------------
// Problem 125
// ----------- 
// The palindromic number 595 is interesting because it can be written as the sum of consecutive 
// squares: 6^2 + 7^2 + 8^2 + 9^2 + 10^2 + 11^2 + 12^2.

// There are exactly eleven palindromes below one-thousand that can be written as consecutive square sums, and the sum of these 
// palindromes is 4164. Note that 1 = 0^2 + 1^2 has not been included as this problem is concerned with the squares of positive 
// integers.
// Find the sum of all the numbers less than 10^8 that are both palindromic and can be written 
// as the sum of consecutive squares.

const assert = require('assert');

function isPalindrome(value)
{
    value = value.toString();

    for (let i = 0, j = value.length-1; i < j; i++, j--)
    {
        if (value[i] !== value[j])
            return false;
    }

    return true;
}

function *generateSquareSums(max)
{
    let used = new Int8Array(max);
    let stop = false;

    function *inner(first)
    {
        let value = first * first;
        if (value >= max)
        {
            stop = true;
            return;
        }

        for (let a = first+1; ; a++)
        {
            value += a*a;
            if (value >= max)
                break;

            if (used[value] !== 1)
            {
                used[value] = 1;
                if (isPalindrome(value))
                    yield value;
            }
        }
    }

    for (let a = 1; ! stop; a++)
    {
        yield *inner(a);
    }
}

function solve(max)
{
    let total = 0;

    for (let value of generateSquareSums(max))
    {
        total += value;
    }

    return total;
}

assert.equal(solve(1000), 4164);

let answer = solve(1E8);
console.log('Answer is', answer);