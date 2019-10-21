const assert = require('assert');
const timeLog = require('tools/timeLogger');

require('tools/bigintHelper');
require('tools/numberHelper');

const MODULO   = 1000000007;
const MODULO_N = BigInt(MODULO);
const TEN      = 10n;

function s(n)
{
    let m = (n % 9n)
    let v = m + 1n;
    let x = (n-m) / 9n;

    let r = TEN.modPow(x, MODULO_N).modMul(v, MODULO_N) - 1n;
    if (r < 0n)
        r = MODULO_N-1n;

    return Number(r);
}

const $lastS = { k: 0n, total: 0 };

function S(k)
{
    k = BigInt(k);
    let start = $lastS.k + 1n;
    let total = $lastS.total;

    if (start > k)
    {
        start = 1n;
        total = 0;
    }

    let startValue = s(start);

    while(/*start % 9n != 0 &&*/ start <= k)
    {
        startValue = s(start);

        total = (total + startValue) % MODULO;

        start++;
    }
/*
    if (start <= k)
    {
        const H = 1+2+3+4+5+6+7+8+9;

        let power = 10;
        let previous = startValue;

        while (start+9n <= k)
        {
            let value    = (previous.modMul(9, MODULO) + H.modMul(power, MODULO)) % MODULO;

            total = (total + value) % MODULO;

            previous = (previous.modMul(10, MODULO) + 9) % MODULO;
            power    = power.modMul(10, MODULO);
            start   += 9n;
        }
    }
*/
    $lastS.k = k;
    $lastS.total = total;

    return total;
}

function solve(max)
{
    let f0 = 0n;
    let f1 = 1n;

    let total = 0;

    for (let i = 2; i <= max; i++)
    {
        process.stdout.write(`\r  ${max-i}  \r`);
        let f = f0+f1;
        f0 = f1;
        f1 = f;

        let v = S(f);
        total = (total + v) % MODULO;
    }
    console.log('\r');
    return total;
}

assert.equal(s(10n), 19);
assert.equal(S(20n), 1074);
// assert.equal(S(1234567n), 312087128);

// console.log('S(9)', S(9));
// console.log('S(19)', S(19));
// console.log('S(29)', S(29));
// console.log('S(39)', S(39));
// console.log('S(49)', S(49));
// console.log('S(59)', S(59));

let answer = timeLog.wrap('', () => {
    return solve(34);
});
console.log('Answer is', answer);