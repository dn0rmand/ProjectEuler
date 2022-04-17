const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 10n ** 16n;
const MODULO = 1000000007n;

function f(n, k)
{
    if (k === 1)
        return n;

    function inner(previous, remainder, k)
    {
        if (remainder <= previous)
            return 0;
        if (k === 1)
            return 1;

        let max = Math.floor(remainder / k);
        for (let b = max; b > previous ; b--)
        {
            let v = inner(b, remainder-b, k-1);
            if (v)
                return v;
        }
        return 0;
    }

    let max = Math.floor(n / k);

    for (let a = max; a > 0 ; a--)
    {
        if (inner(a, n-a, k-1))
            return a;
    }

    return  0;
}

function S(n, trace)
{
    n = BigInt(n);

    let sum   = 1n;
    let total = (n*(n+1n))/2n;

    let traceCount = 0;
    for(let k = 2n; ; k++)
    {
        sum += k;
        if (sum > n)
            break;

        if (trace)
        {
            if (traceCount == 0)
                process.stdout.write(`\r${k}`);
            if (++traceCount >= 1000)
                traceCount = 0;
        }

        let zeros = (k-1n)*(k+2n)/2n;
        let x     = (n-zeros) / k;
        let y     = n - zeros - x*k;

        let V = ((x*(x+1n))/2n)*k + y*(x+1n);

        total = (total + V) % MODULO;
    }

    return Number(total);
}

assert.equal(f(10, 3), 2);
assert.equal(f(10, 5), 0);
assert.equal(S(100), 12656);

console.log('Tests passed');

let answer = timeLog.wrap('', () => S(MAX, true));

console.log('Answer is', answer);
