const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const prettyTime = require('pretty-hrtime');

require('tools/numberHelper');

const MAX = 10000000;
const MODULO = 1000000087;

primeHelper.initialize(MAX);

function S(n)
{
    let total = 1;
    primeHelper.factorize(n, (p, f) =>
    {
        let t = 1 + 2*f;
        total = total.modMul(t, MODULO);
    });
    return total;
}

function factorial(n)
{
    let v = 1;

    for (let i = 2; i <= n; i++)
        v *= i;

    return v;
}

function F(n, trace)
{
    let previous = S(2);
    let total    = previous;
    let primes   = { "2": 1 };
    let count    = 0;

    for (let i = 3; i <= n; i++)
    {
        if (trace)
        {
            if (count-- === 0)
            {
                process.stdout.write(`\r${n-i} `);
                count = 999;
            }
        }

        let newValue = previous;
        primeHelper.factorize(i, (p, c) => {
            let c1 = primes[p] || 0;
            let c2 = c + c1;
            primes[p] = c2;

            let n = (1 + 2*c2) % MODULO;
            let d = (1 + 2*c1) % MODULO;

            newValue = newValue.modMul(n, MODULO);
            newValue = newValue.modDiv(d, MODULO);
        });
        previous = newValue;
        total = (total + newValue) % MODULO;
    }
    if (trace)
        process.stdout.write('\r     \r');
    return total;
}

assert.equal(S(6), 9);
assert.equal(S(factorial(10)), 2295);
assert.equal(F(10), 4821);
console.log('Tests passed');

let timer = process.hrtime();
let answer = F(MAX, true);
timer = process.hrtime(timer);

console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

