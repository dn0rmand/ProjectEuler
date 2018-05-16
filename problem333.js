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

function *generate()
{
    let products = [];

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
        if (value > MAX)
            return;

        if (value !== 0)
        {
            if (helper.isPrime(value))
                yield value;
        }

        for (let i = index; i < possible.length; i++)
        {
            let o = possible[i];

            if (value + o > MAX)
                continue;
            
            if (isValid(o))
            {
                products.push(o);
                yield *inner(value + o, i+1);
                products.pop();
            }
        }
    }

    yield *inner(0, 0);
}

helper.initialize(MAX);

let total = 0; 
let visited = new Map();

for (let v of generate())
{
    let n = visited.get(v);

    if (n === 1)
    {
        total -= v;
        visited.set(v, 2);
    }
    else if (n === undefined)
    {
        total += v; 
        visited.set(v, 1);
    }
}

console.log("And the answer is ....... " + total);