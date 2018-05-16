const assert = require('assert');
const helper = require('./tools/primeHelper.js')();

const MAX = 1000000
const MAX_2 = 20
const MAX_3 = 13

function possiblePartitions()
{
    let products = [];
    let yielded = {};

    function isValid(v)
    {
        for(let p of products)
        {
            if ((p % v) === 0 || (v % p) === 0)
                return false;
        }

        return true;
    }

    let i = 0, j = 0;

    for (let i = MAX_2 ; i > 0; i--)
    {
        let v2 = Math.pow(2, i-1);
        
        for (let j = MAX_3; j > 0; j--)
        {
            let v3 = Math.pow(3, j-1);
            let v = v3 * v2;
            if (v < 2 || v > MAX)
                continue;
            
            products.push(v);
        }
    }

    products = products.sort((a, b) => { return b-a; })
    return products;
}

let possible = possiblePartitions();

function *partition(value)
{
    let products = [];
    let yielded = {};

    function isValid(v)
    {
        for(let p of products)
        {
            if ((p % v) === 0 || (v % p) === 0)
                return false;
        }

        return true;
    }

    function *inner(value, index)
    {
        if (value === 0)
        {
            let p = products.toString();
            if (yielded[p] === undefined)
            {
                yielded[p] = 1;
                yield products;
            }
            return;
        }
        if (value < 2)
            return;

        for (let i = index; i < possible.length; i++)
        {
            let v = possible[i];
            if (v > value)
                continue;
            
            if (! isValid(v))
                continue;

            products.push(v);
            yield *inner(value-v, i+1);
            products.pop(v);
        }
    }

    yield *inner(value, 0);
}

function hasOnlyOne(number)
{
    let c = 0;
    for (let p of partition(number))
    {
        c++;
        if (c > 1)
            return false;
    }
    return c === 1;
}

assert.equal(hasOnlyOne(17), true);
assert.equal(hasOnlyOne(11), false);

helper.initialize(MAX);

let total = 0;

for(let p of helper.primes())
{
    if (p >= MAX)
        break;
    if (hasOnlyOne(p))
    {
        //console.log(p);
        total += p;
    }
}

console.log(total);