const assert = require('assert');
const divisors = require('tools/divisors');
const timerLog = require('tools/timeLogger');

const MAX = 1000000

function digitSum(value)
{
    let total = value - (Math.floor((value-1) / 9) * 9);
    return total;
}

const $mdrs = [];

function mdrs(value)
{
    if ($mdrs[value] !== undefined)
        return $mdrs[value];

    let max = digitSum(value);
    for (let d of divisors(value))
    {
        if (d !== 1 && d !== value)
        {
            let s = mdrs(d) + mdrs(value / d);
            if (s > max)
                max = s;
        }
    }
    $mdrs[value] = max;
    return max;
}

function solve(max, trace)
{
    let total = 0;

    let traceCount = 0;
    for (let n = 2; n < max; n++)
    {
        if (trace)
        {
            if (traceCount++ === 0)
                process.stdout.write(`\r${max - n} `);
            if (traceCount > 1000)
                traceCount = 0;
        }
        total += mdrs(n);
    }
    return total;
}

assert.equal(mdrs(24), 11);

let total = timerLog.wrap('', () => {
    return solve(MAX, true);
});

console.log('\rAnswer is', total, 'expected 14489159');
