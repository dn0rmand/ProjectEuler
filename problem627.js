// Counting products
// Problem 627

// Consider the set S of all possible products of n positive integers not exceeding m , 
// that is S={ x1x2…xn|1 ≤ x1,x2,...,xn ≤ m }

// Let F(m,n) be the number of the distinct elements of the set S

// For example, F(9,2)=36 and F(30,2)=308.

// Find F(30,10001) mod 1000000007.

const assert = require('assert');
const primeHelper = require('./tools/primeHelper')();
const bigInt = require('big-integer');

primeHelper.initialize(300);

function F(m, n)
{
    let factors = [];
    let visited = new Set();
    let values  = [];
    let total    = 0;

    function factorize(value)
    {
        if (factors[value] !== undefined)
            return factors[value];

        let facts = [];
        let v = value;
        for (let p of primeHelper.primes())
        {
            if (p > v)
                break;

            if (v % p === 0)
            {
                while (v % p === 0)
                {
                    facts.push(p);
                    v /= p;
                }
            }
        }
        if (v !== 1)
            throw error;
                
        factors[value] = facts;

        return facts;
    }

    function inner(start, count)
    {
        if (count === n)
        {
            if (values.length > 0)
            {
                let a = Array.from(values);
                let k = a.sort((a,b) => a-b).join('-');

                if (! visited.has(k))
                {
                    visited.add(k);
                    total++;
                }
            }
            return;
        }

        for (let x = start; x <= m ; x++)
        {
            if (x === 1)
            {
                inner(x, count+1);
            }
            else
            {
                let size = values.length;
                let f = factorize(x);
                values.push(...f);
                inner(x, count+1);
                while (values.length !== size)
                    values.pop();
            }
        }
    }

    inner(1, 0);
    return total+1;
}

function test()
{
    assert.equal(F(9, 2), 36);
    assert.equal(F(30,2), 308);    
    console.log("Tests passed");
}

function test3()
{
    for (let p of primeHelper.primes())
    {
        let v = F(p,2);
        let x = (v - (v % p))/p;
        console.log("F(" + p + ", 2) =", v, x);
    }
}

test();
test3();

//let result = F(30,10001);

console.log('Done');
