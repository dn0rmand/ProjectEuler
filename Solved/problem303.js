const assert = require('assert');
const prettyTime= require("pretty-hrtime");
const getDigits = require('tools/digits');

const MAX = 10000;
const $f  = [];

function isValid(n)
{
    while (n > 0)
    {
        let d = n % 10n;
        if (d > 2)
            return false;
        n = (n-d) / 10n;
    }

    return true;
}

function getNextTarget(result)
{
    let digits = getDigits(result);
    for (let i = 0; i < digits.length; i++)
    {
        if (digits[i] > 2)
        {
            let k = i;
            for (let j = i-1; j >= 0; j--)
            {
                if (++digits[j] > 2)
                   k = j;
                else
                    break;
            }
            if (k === 0)
                return 10n ** BigInt(digits.length);

            let target = 0n;
            for (let j = 0; j < digits.length; j++)
            {
                target *= 10n;
                if (j < k)
                    target += BigInt(digits[j]);
            }
            return target;
        }
    }

    throw "Not possible";
}

function bruteA(n)
{
    n = BigInt(n);
    let result = n;
    while (! isValid(result))
    {
        let target = getNextTarget(result);
        if (target)
        {
            let times;
            if (target % n == 0)
                times = target / n;
            else
                times = (target / n) + 1n;
            result = n * times;
        }
        else
        {
            result += n;
        }
    }

    let times = Number(result / n);
    return times;
}

function a(n)
{
    let times = $f[n];
    if (times !== undefined)
        return times;

    if (times === undefined)
        times = bruteA(n);

    while (n < MAX)
    {
        $f[n] = times;
        n *= 10;
    }

    return times;
}

function f(n)
{
    return n * a(n);
}

function solve(max, trace)
{
    let total = 0;

    for (let n = 1; n <= max; n++)
    {
        if (trace)
            process.stdout.write(`\r${n}`);
        let times = a(n);

        total += times;
    }

    if (trace)
        process.stdout.write('\r         \r');

    return total;
}

assert.equal(a(9899), 1122559978);
assert.equal(f(2), 2);
assert.equal(f(3), 12);
assert.equal(f(7), 21);
assert.equal(f(42), 210);
assert.equal(f(89), 1121222);
assert.equal(solve(100), 11363107);

console.log('Test passed');

let timer = process.hrtime();
const answer = solve(10000, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
