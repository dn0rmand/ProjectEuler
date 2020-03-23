/*
If n = (p1^a1)(p2^a2)...(pt^at), a(n) = ((2*a1 + 1)(2*a2 + 1) ... (2*at + 1) + 1)/2
*/

const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();
const MAX = 1E12

primeHelper.initialize(1E6);

function f(n)
{
    let value = 1;

    primeHelper.factorize(n, (_, f) => {
        value *= (f+f+1);
    });

    value = (value+1)/2;

    return value;
}

function g(n)
{
    let total = 0;
    for(let i = 1; i <= n; i++)
    {
        total += f(i);
    }
    return total;
}

assert.equal(g(1E6), 37429395);
console.log('Tests passed');

let values = [];
let previous = 0;

for(let i = 1; i < 50; i++)
{
    let v = f(i);
    values.push((v-previous));
    previous = v;
}
console.log(values.join(', '));

