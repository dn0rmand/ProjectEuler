const assert = require('assert');
const bigInt = require('big-integer');
const primes = require('./tools/primes.js');

const primes41    = [];
const primes43    = [];
const primeLookup = primes();

function *nextPrime()
{
    while (true)
    {
        let p = primeLookup.next().value;

        yield p;
    }
}

function *my43Primes()
{
    for(let p of primes43)
        yield p;

    for(let p of nextPrime())
    {
        if ((p % 4) === 1)
            primes41.push(p)
        else
        {
            primes43.push(p);
            yield p;
        }
    }
}

function *my41Primes()
{
    for(let p of primes41)
        yield p;

    for(let p of nextPrime())
    {
        if ((p % 4) === 1)
        {
            primes41.push(p)
            yield p;
        }
        else
            primes43.push(p);
    }
}

function makeReference(MAX)
{
    let references = [];

    function makeNumbers(powers)
    {
        function innerMakeNumbers(index, usedPrimes, value)
        {
            if (index >= powers.length)
            {
                references.push(value);
                return;
            }

            for(let p of my41Primes())
            {
                if (usedPrimes.includes(p))
                    continue;
                
                let newValue = value * Math.pow(p, powers[index]);
                if (newValue <= MAX)
                {
                    usedPrimes.push(p);
                    innerMakeNumbers(index+1, usedPrimes, newValue);
                    usedPrimes.pop();
                }
                else
                    break;
            }
        }

        innerMakeNumbers(0, [], 1);
    }

    makeNumbers([17, 1]);
    makeNumbers([10, 2]);
    makeNumbers([7, 3]);
    makeNumbers([3, 2, 1]);

    return references;
}

function solve(MAX)
{
    let SUM     = bigInt(0);
    let visited = new Map();

    function makeMore(value)
    {
        if (value > MAX)
            return;

        if (visited.has(value))
            return;

        visited.set(value, 1);
        SUM = SUM.plus(value);
        for(let p of my43Primes())
        {
            var n = p*value;
            if (n > MAX)
                break;            
            makeMore(n);
        }
    }

    let references = makeReference(MAX);
    
    for(let reference of references)
    {
        makeMore(reference);
    }

    console.log(MAX + " -> " + SUM.toString());
}

solve(38000000);
solve(100000000000);
