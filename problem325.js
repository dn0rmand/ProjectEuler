const assert = require('assert');
const bigNumber = require('bignumber.js');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');
require('tools/bigintHelper');

const MODULO =  7n ** 10n;
const MAX    = 10n ** 18n;

function S(N, trace)
{
    N = BigInt(N);

    const tau    = (3 - Math.sqrt(5)) / 2;
    const modulo = Number(MODULO);

    let total       = 0;
    let traceCount  = 0;

    let remainder =  Number(N % MODULO);
    let multiplier=  Number((N - (N % MODULO)) / MODULO);

    let subTotal = 0;
    let target   = modulo-1;

    for (let i = 0; i <= target; i++)
    {
        if (trace)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${target - i}`);
            if (traceCount >= 1000)
                traceCount = 0;
        }

        let count = Math.floor(i * tau) % modulo;
        let v2    = (count.modMul(count, modulo) + count) % modulo;
        let v1    = i.modMul(count, modulo).modMul(4, modulo);
        let v3    = v1 - v2;
        while (v3 < 0)
            v3 += modulo;

        total = (total + v3) % modulo;
        if (i === remainder)
        {
            subTotal = total;
            if (multiplier < 1)
                break;
        }
    }

    total = total.modMul(multiplier);
    total = (total + subTotal);
    total = total.modDiv(2, modulo);

    if (trace)
        console.log('');

    return total;
}

assert.equal(S(10), 211);
assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

let timer = process.hrtime();
let answer = S(MAX, true); // 258929048
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
