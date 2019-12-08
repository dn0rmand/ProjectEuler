const assert = require('assert')
const timeLog = require('tools/timeLogger');

const MAX = 23416728348467685n;

const FIBS = (function()
{
    const fibs = [0n];
    let f0 = 0n;
    let f1 = 1n;

    while (f1 <= MAX)
    {
        fibs.push(f1)

        let f = f0+f1
        f0 = f1
        f1 = f;
    }

    return fibs;
})();

const FIBSMAP = new Set();

for (f of FIBS)
    FIBSMAP.add(f);

function findMinFib(value)
{
    if (FIBSMAP.has(value))
        return value;

    let min = 0;
    let max = FIBS.length-1
    let middle = max >> 1;
    while (min < max)
    {
        let f = FIBS[middle];
        if (value == f)
            return f;
        let direction = 0;
        if (value < f)
        {
            max = middle-1;
            direction = -1;
        }
        else
        {
            min = middle+1;
            direction = 1;
        }
        let m = (max+min)>>1;
        if (m === middle)
        {
            middle += direction;
            if (direction < 0)
                max--;
            else
                min++;
        }
        else
            middle = m;
    }
    let m = Math.min(min, max);
    if (FIBS[m] > value)
    {
        if (! (FIBS[m-1] < value))
            assert.fail();
        return FIBS[m-1];
    }
    else
    {
        if (!(FIBS[m+1] > value))
            assert.fail();
        return FIBS[m];
    }
}

function H(n)
{
    function canWin(pebbles, max, player)
    {
        if (max >= pebbles)
            return true;

        for(let p = 1; p <= max; p++)
        {
            if (!canWin(pebbles-p, 2*p, (player+1) % 2))
                return true;
        }
        return false;
    }

    for (let x = 1; x < n; x++)
    {
        if (! canWin(n-x, 2*x, 1))
            return x;
    }

    return n;
}

function a(n)
{
    n = BigInt(n);

    let f = findMinFib(n);
    if (f == n)
        return n;
    return a(n-f);
}

function G(n, trace)
{
    n = BigInt(n);

    let total  = 0n;
    let traceCount = 0;

    for (let p = 1n; p <= n; p++)
    {
        if (trace)
        {
            if (traceCount == 0)
                process.stdout.write(`\r${n-p}  `);
            traceCount++;
            if (traceCount >= 10000)
                traceCount = 0;
        }

        total += a(p);
    }
    if (trace)
        process.stdout.write("\r      \r");

    return total;
}

assert.equal(H(1),  1);
assert.equal(H(4),  1);
assert.equal(H(17), 1);
assert.equal(H(8),  8);
assert.equal(H(18), 5);

assert.equal(G(13), 43);

console.log('Tests passed');

function solve()
{
    let total = 0n;
    for (let n = 0; n < FIBS.length-5; n++)
    {
        let N = BigInt(n);
        let A = ((N+2n)*FIBS[n+4] + (N-1n)*FIBS[n+2]) / 5n;

        total += A;
    }
    for (let f of FIBS)
        total += f;

    return total-1n;
}

let answer = timeLog.wrap('', () => solve());

console.log(`Answer is ${answer}`);