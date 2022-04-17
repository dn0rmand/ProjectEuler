// Prime triplets
// Problem 196 
// Build a triangle from all positive integers in the following way:

//  1
//  2  3
//  4  5  6
//  7  8  9 10
// 11 12 13 14 15
// 16 17 18 19 20 21
// 22 23 24 25 26 27 28
// 29 30 31 32 33 34 35 36
// 37 38 39 40 41 42 43 44 45
// 46 47 48 49 50 51 52 53 54 55
// 56 57 58 59 60 61 62 63 64 65 66
// . . .

// Each positive integer has up to eight neighbours in the triangle.

// A set of three primes is called a prime triplet if one of the three primes has the other two as neighbours in the 
// triangle.

// For example, in the second row, the prime numbers 2 and 3 are elements of some prime triplet.

// If row 8 is considered, it contains two primes which are elements of some prime triplet, i.e. 29 and 31.
// If row 9 is considered, it contains only one prime which is an element of some prime triplet: 37.

// Define S(n) as the sum of the primes in row n which are elements of any prime triplet.
// Then S(8)=60 and S(9)=37.

// You are given that S(10000)=950007619.

// Find  S(5678027) + S(7208785).

const assert = require('assert');
const bigInt = require('big-integer');
const $isPrime= require('@dn0rmand/project-euler-tools/src/isPrime.js');

let memoize = new Map();

function isPrime(n)
{
    if (n === 2)
        return true;
    if ((n & 1) === 0)
        return false;
    if ((n % 3) === 0)
        return false;
    let r = memoize.get(n);
    if (r === undefined)
    {
        r = $isPrime(n);
        memoize.set(n, r);
    }
    return r;
}

function clearPrimes()
{
    memoize = new Map();
}

function rowInfo(n)
{
    let start = 1;
    let length= 1;
    
    for (let row = 2; row <= n; row++)
    {
        start = start+length;
        length++;
    }

    return start;
}

function S(n)
{    
    function *neighbours(value, min, max, length)
    {
        let v = value - (length-1);
        for (let i = min; i <= max; i++)
            yield v+i;
        v = value + length;
        for (let i = min; i <= 1; i++)
            yield v+i;
    }

    let value = rowInfo(n);
    let length= n;
    
    let i = 0;
    if ((value & 1) === 0)
    {
        value++;
        i = 1;
    }

    let sum = bigInt(0);
    let min = 0;

    for( ; i < length; i += 2, value += 2)
    {
        if (! isPrime(value))
            continue;

        let count = 1;
        let min = (i === 0) ? 0 : -1;
        let max = (i === length-1) ? 0 : 1;

        for(let p of neighbours(value, min, max, length))
        {
            if (isPrime(p))
            {
                count++;
                if (count >= 3)
                    break; // enough primes

                let _max = max;
                let _length = length;
                if (p < value)
                {
                    _length--;
                    if (max === 0 && p === value-length)
                        max = -1;
                    else if (i <= _length-1)
                        max = 0;
                }
                else
                {
                    _max = 1;
                    _length++;
                }
                for(let p2 of neighbours(p, min, _max, _length))
                {
                    if (p2 === value || p2 === p)
                        continue;
                    if (isPrime(p2))
                    {
                        count++;
                        break; // enough primes
                    }
                }

                if (count >= 3)
                    break;
            }
        }
        if (count >= 3)
            sum = sum.plus(value);
    }

    return sum;
}

// assert.equal(S(8), 60);
// assert.equal(S(9), 37);
// assert.equal(S(10000), 950007619);

// clearPrimes();
// assert.equal(S(100000), 549999566882);

// clearPrimes();
// assert.equal(S(200000), 8980000676761);
// assert.equal(S(200001), 4040040647250);
// assert.equal(S(200002), 3660072967149);

// clearPrimes();
// assert.equal(S(500005), 134752693946582);

clearPrimes();
let sum1 = S(5678027); //79697256800321526

console.log("  S(5678027) =>   " + sum1.toString());

clearPrimes();
let sum2 =  S(7208785); // 242605983970758409

console.log("                +")
console.log("  S(7208785) =>  " + sum2.toString());
console.log("                 ------------------");
console.log("                 " + sum1.add(sum2).toString()); // 322303240771079935
