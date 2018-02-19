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

const factorialCache = [];

function factorial(n)
{
//    nPr(n,r) = n! / (n-r)!

    if (n < 2)
        return 1;

    let v = factorialCache[n];
    if (v === undefined)
    {
        v = n * factorial(n-1);
        factorialCache[n] = v;
    }
    return v;
}

function nPr(n ,r)
{
    assert.ok(n >= r);
    return factorial(n) / factorial(n-r);
}

function nCr(n, r)
{
    return nPr(n,r) / factorial(r);
}

let memoizeWays = [];

function possibleWays(n)
{
    if (n === 1)
        return [];

    let solutions = memoizeWays[n];
    if (solutions !== undefined)
        return solutions;

    solutions = [];

    let middle = n >> 1;
    let map = new Map();

    for (let x = 1; x <= middle; x++)
    {
        solutions.push([x, n-x]);
        let ways = possibleWays(n-x);
        for (let way of ways)
        {
            let sol = [x];
            sol.push(...way);
            sol.sort();
            let key = sol.join('+');
            if (! map.has(key))
            {
                map.set(key, 1);
                solutions.push(sol);
            }
        }
    }

    console.log(n + " = " + solutions.length);
    memoizeWays[n] = solutions;
    return solutions;
}

function countPossibleWays(n)
{
    let solutions = possibleWays(n);
    return solutions.length;
}

// console.log('4 -> ' + countPossibleWays(4));
// console.log('5 -> ' + countPossibleWays(5));
// console.log('6 -> ' + countPossibleWays(6));
console.log('40 -> ' + countPossibleWays(40));

//let value  = countPossibleWays(100);

//console.log("100 -> " + value);
