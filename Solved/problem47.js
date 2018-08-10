// Distinct primes factors
// Problem 47 
// The first two consecutive numbers to have two distinct prime factors are:

// 14 = 2 × 7
// 15 = 3 × 5

// The first three consecutive numbers to have three distinct prime factors are:

// 644 = 2² × 7 × 23
// 645 = 3 × 5 × 43
// 646 = 2 × 17 × 19.

// Find the first four consecutive integers to have four distinct prime factors each. What is the first of these numbers?

const isPrime = require("tools/isPrime.js");

// 2, 3, 5, 7, 11

const MIN = 2*3*5*7; // Product of first 4 primes

function *getPrimeDivisors(value)
{
    for(let i = 2; i <= value && value > 1; i++)
    {
        if (! isPrime(i))
            continue;

        if ((value % i) == 0)
        {
            value = value / i;
            yield i;
            i--;
            if (isPrime(value))
            {
                yield value;
                break
            }
        }
    }
}

function hasDistinctDivisors(value, count)
{
    let iter = getPrimeDivisors(value);
    let map = new Map();

    for (let d = iter.next(); ! d.done; d = iter.next())
    {
        if (map.has(d.value))
            continue;
        map.set(d.value, 1);
        count--;
        if (count === 0)
            return true;
    }
    return false;
}

function dumpDivisors(value)
{
    let iter = getPrimeDivisors(value);
    let s = value + '=';

    for (let d = iter.next(); ! d.done; d = iter.next())
    {
        if (s == '')
            s = value + '=' + d.value;
        else
            s += 'x' + d.value;        
    }
    console.log(s);
}

function tests()
{
    dumpDivisors(14);
    dumpDivisors(15);
    dumpDivisors(644);
    dumpDivisors(645);
    dumpDivisors(646);

    if (! hasDistinctDivisors(14, 2))
        throw "hasDistinctDivisors not working";
    if (! hasDistinctDivisors(15, 2))
        throw "hasDistinctDivisors not working";

    if (! hasDistinctDivisors(644, 3))
        throw "hasDistinctDivisors not working";
    if (! hasDistinctDivisors(645, 3))
        throw "hasDistinctDivisors not working";
    if (! hasDistinctDivisors(646, 3))
        throw "hasDistinctDivisors not working";
}

for(let value = MIN; ; value++)
{
    if (isPrime(value) ||
        isPrime(value+1) || 
        isPrime(value+2) ||
        isPrime(value+3)) continue;    

    if (hasDistinctDivisors(value, 4) &&
        hasDistinctDivisors(value+1, 4) &&
        hasDistinctDivisors(value+2, 4) &&
        hasDistinctDivisors(value+3, 4))
    {
        console.log("First of the first 4 consecutive integers to have 4 distinct prime factors each is " + value);
        break;
    }
}