const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MODULO = 1E6;

// Brute force version: Worked but took a long time

const $memoize = [ [], [] ];

function tt(n)
{
    function inner(sum, hasTwo) // hasTwo = 0 or 1
    {
        if (sum < 0)
            return 0;

        if (sum === 0)
            return hasTwo;

        let total = $memoize[hasTwo][sum];
        if (total !== undefined)
            return total;

        if (sum === 2)
            total = 1;
        else
            total = hasTwo;

        let middle  = Math.floor(sum / 2);

        total = (total + inner(sum-2, hasTwo)) % MODULO;
        total = (total + inner(sum-4, 1)) % MODULO;

        for(let v = 3; v <= middle; v++)
            total = (total + inner(sum-v-v, hasTwo)) % MODULO;

        $memoize[hasTwo][sum] = total;
        return total;
    }

    let total = inner(n, 0);

    return total;
}

// Faster version found out from the problem's thread

const $a = [];

function a(n)
{
    // a(0) = 0, a(1) = a(2) = a(3) = 1; thereafter, a(n) = a(n-1) + a(n-2) + a(n-4). 

    if (n === 0)
        return 0;
    else if (n <= 3)
        return 1;
 
    if ($a[n] === undefined)
        $a[n] = (a(n-1) + a(n-2) + a(n-4)) % MODULO;

    return $a[n];
}

const $t = [];

function t(n)
{
    // odd: t(n)=t(n−2)+t(n−3);
    // even:t(n)=t(n+1)+a(n/2) ( a = A005251 )

    if (n <= 0)
        return 0;

    if ($t[n] !== undefined)
        return $t[n];

    if (n & 1)
    {
        $t[n] = (t(n-2) + t(n-3)) % MODULO;
    }
    else
    {
        $t[n] = (t(n+1) + a(n / 2)) % MODULO;
    }

    return $t[n];
}

function solve()
{
    const tracer = new Tracer(1000, true);

    for(let n = 42; ; n++)
    {
        if (n > Number.MAX_SAFE_INTEGER)
            throw "NEED BIG INT";

        let v = t(n);
        if (v === 0)
        {
            tracer.clear();
            return n;
        }
        tracer.print(_ => n);
    }
}

assert.equal(t(6), 4);
assert.equal(t(20), 824);
assert.equal(t(42), 1999923 % MODULO);
console.log('Tests passed');

let answer = timeLogger.wrap('', _ => solve());
console.log('Answer is', answer);
