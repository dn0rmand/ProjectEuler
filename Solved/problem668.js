const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const prettyTime= require("pretty-hrtime");

const MAX = 10000000000;
const MAX_ROOT = Math.sqrt(MAX);

primeHelper.initialize(MAX_ROOT, true);
const allPrimes = primeHelper.allPrimes();

function solve(max)
{
    let total = 1;

    function inner(value, index, pSquare)
    {
        if (pSquare < value)
            total++;

        for (let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let pp = p*p;
            let v = value*p;
            if (v > max)
                break;

            while (v <= max)
            {
                inner(v, i+1, pp);
                v *= p;
            }
        }
    }

    inner(1, 0, 1);
    return total;
}

assert.equal(solve(100), 29);
console.log('Test passed');

let timer = process.hrtime();
let answer = solve(MAX);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));