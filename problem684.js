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

function S1(k)
{
    k = BigInt(k);
    let start = $lastS.k + 1n;
    let total = $lastS.total;

    if (start > k)
    {
        start = 1n;
        total = 0;
    }

    while(start % 9n != 0 && start <= k)
    {
        let value = s(start);

        total = (total + value) % MODULO;

        start++;
    }

    // Faster
    if (start <= k)
    {
        const H = 1+2+3+4+5+6+7+8+9;

        let previous = s(start);
        let power    = (previous+1) % MODULO;

        total = (total + previous) % MODULO;
        start++;
        while (start+9n <= k)
        {
            let value = (previous.modMul(9, MODULO) + H.modMul(power, MODULO)) % MODULO;

            total = (total + value) % MODULO;

            previous = (previous.modMul(10, MODULO) + 9) % MODULO;
            power    = power.modMul(10, MODULO);
            start   += 9n;
        }
    }

    // Finish
    while(start <= k)
    {
        let value = s(start);

        total = (total + value) % MODULO;

        start++;
    }

    $lastS.k = k;
    $lastS.total = total;

    return total;
}

function S(k)
{
    let n     = k - (k % 9n);
    let total = 10n.modPow(n/9n, MODULO_N).modMul(6n, MODULO_N) - ((6n + n) % MODULO_N);

    while (total < 0)
        total += MODULO_N;

    total = Number(total % MODULO_N);

    for(let m = n + 1n; m <= k; m++)
        total = (total + s(m)) % MODULO;

    return total;
}

function solve(max)
{
    let f0 = 0n;
    let f1 = 1n;

    let total = 0;

    for (let i = 2; i <= max; i++)
    {
        let f = f0+f1;
        f0 = f1;
        f1 = f;

        let v = S(f);
        total = (total + v) % MODULO;
    }
    return total;
}

assert.equal(s(10n), 19);
assert.equal(S(20n), 1074);
assert.equal(S(1234567n), 312087128);
assert.equal(solve(30), 159166760);
assert.equal(solve(31), 979170050);
assert.equal(solve(32), 725966949);
assert.equal(solve(33), 319026893);

console.log('Tests passed');

const MAX = 90;

let answer = timeLog.wrap('', () => {
    return solve(MAX, true);
});
console.log("Answer for", MAX, "is", answer);