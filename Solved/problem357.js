const isPrime = require('./tools/isPrime.js');
const assert  = require('assert');
const primeMemoize = new Map();

function isItPrime(n)
{
    let v = primeMemoize.get(n);
    if (v !== undefined)
        return v;
    v = isPrime(n);
    primeMemoize.set(n, v);
    return v;
}

function *getDivisors(value)
{
    yield 1;
    yield value;

    if (isItPrime(value))
        return;

    let max = value;
    for(let i = 2; i < max; i++)
    {
        if ((value % i) == 0)
        {
            let res = value / i;
            if (res < max)
                max = res;

            yield i;

            if (res != i)
                yield res;
        }
    }
}

function isSpecial(value)
{
    for(let d of getDivisors(value))
    {
        let v = d + value/d;
        if (! isItPrime(v))
            return false;
    }

    return true;
}

assert.ok(isSpecial(1));
assert.ok(isSpecial(30));

let sum = 0;
for(let n = 1; n <= 100000000; n++)
{
    if (isSpecial(n))
        sum += n;
}

console.log(sum);