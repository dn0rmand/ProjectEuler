// Counting summations
// Problem 76 
// It is possible to write five as a sum in exactly six different ways:

// 4 + 1
// 3 + 2
// 3 + 1 + 1
// 2 + 2 + 1
// 2 + 1 + 1 + 1
// 1 + 1 + 1 + 1 + 1

// How many different ways can one hundred be written as a sum of at least two positive integers?

const assert = require('assert');

function possibleWays(m, n) 
{
    if (m === 1 || n === 1) 
    {
        return 1;
    } 
    else if (n >= m) 
    {
        return possibleWays(m, m - 1) + 1;
    } 
    else 
    {
        return possibleWays(m - n, n) + possibleWays(m, n - 1);
    }
}

function countPossibleWays(n)
{
    return possibleWays(n,n)-1;
}

let result = countPossibleWays(100);
console.log(result + " different ways to write one hundred as a sum of at least two positive integers");