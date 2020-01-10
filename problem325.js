const assert = require('assert');
const bigNumber = require('bignumber.js');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');
require('tools/bigintHelper');

bigNumber.set({ DECIMAL_PLACES: 20 });

const MODULO = 7n ** 10n;
const MAX    = 10n ** 9n;

function bruteForce(N)
{
    function canWin(x, y)
    {
        if (x > y)
            [x, y] = [y, x];

        if (y % x == 0)
            return true;
        for(let i = 1; ; i++)
        {
            let v = i*x;
            if (v > y)
                break;
            if  (v == y)
                return true;

            if (isLosing(x, y - v))
                return true;
        }

        return false;
    }

    function isLosing(x, y)
    {
        if (x > y)
            [x, y] = [y, x];

        if (y % x == 0)
            return false;

        for(let i = 1; ; i++)
        {
            let v = i*x;
            if (v > y)
                break;
            if  (v == y)
                return false;

            if (! canWin(x, y - v))
                return false;
        }

        return true;
    }

    function F(v)
    {
        if (v < 10)
            return '  ' + v;
        else if (v < 100)
            return ' ' + v;
        else
            return '' + v;
    }

    let graph = [];
    let total = 0;

    for (let x = 1; x < N; x++)
    for (let y = x+1; y <= N; y++)
    {
        if (isLosing(x, y))
        {
            if (graph[x])
                graph[x].push(F(x+y));
            else
                graph[x] = [F(x+y)];

            total += (x+y);
        }
    }
    for (let i = 1; i < graph.length; i++)
    {
        var a = graph[i];
        if (a)
        {
            console.log(...a);
        }
        else
            console.log(`no entry for x = ${i}`);
    }

    return total;
}

function growing2(callback)
{
    let l1 = 1, o1 = 1;
    let l2 = 2, o2 = 1;

    if (callback(l1, o1) === false)
        return;
    if (callback(l2, o2) === false)
        return;

    while(true)
    {
        l = l1+l2;
        o = o1+o2;

        if (callback(l, o) === false)
            break;

        l1 = l2;
        o1 = o2;
        l2 = l;
        o2 = o;
    }
}

function S2(N, trace)
{
    function evenSum(N)
    {
        let n  = N / 2n;
        return n*(n+1n);
    }

    function oddSum(N)
    {
        return (N*(N+1n) / 2n) - evenSum(N);
    }

    function *growing1(callback)
    {
        const FLOOR   = 3;
        const tau     = bigNumber(5).sqrt().minus(1).dividedBy(2);
        let   current = tau;
    
        while (1)
        {
            const previous = current;
            current = previous.plus(tau).minus(previous.integerValue(FLOOR));
            const x = current.integerValue(FLOOR).toNumber();
            yield x ? 1 : 0;
        }
    }

    function *growing2()
    {
        let first = { value:1 }
        let last  = first;

        while (true)
        {
            let l = last;
            last = { value: 1 }

            yield first.value;
            if (first.value == 1)
                l.next = { value:0, next: last }
            else
                l.next = last;

            first = first.next;
        }
    }

    growing = growing2;

    N = BigInt(N);

    let top     = 5n;
    let bottom  = 2n*N - 1n;
    let total   = 0n;
    let traceCount = 0;

    for(let grow of growing())
    {
        if (trace === true)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${bottom - top}`);
            if (traceCount >= 5000)
                traceCount = 0;
        }

        let sum = 0n;

        if (top & 1n) // odd
        {
            sum = oddSum(bottom) - oddSum(top-2n);
        }
        else
        {
            sum = evenSum(bottom) - evenSum(top-2n);
        }

        if (sum <= 0n)
            break;

        total = (total + sum) % MODULO;

        bottom--;
        if (grow)
            top += 5n;
        else
            top += 3n;
    }

    if (trace)
        console.log('\r       \r');

    return Number(total);
}

function S1(N, trace)
{
    N = Number(N);

    const tau    = (3 - Math.sqrt(5)) / 2;
    const modulo = Number(MODULO);

    let total       = 0;
    let traceCount  = 0;

    for (let i = 3; i <= N; i++)
    {
        if (trace === true)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${N - i}`);
            if (traceCount >= 1000)
                traceCount = 0;
        }

        const count = Math.floor(i * tau) % modulo;
        const v2    = (count.modMul(count, modulo) + count) % modulo;
        const v1    = i.modMul(count, modulo).modMul(4, modulo);

        total = (total + v1 - v2) % modulo;
    }

    total = total.modDiv(2, modulo);

    if (trace)
        console.log('');

    return total;
}

let S = S2;

bruteForce(20); // 28389

assert.equal(S(10), 211);
assert.equal(S(50), 28389);
assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

let timer = process.hrtime();
let answer = S(MAX, true);

// 1E8 => 258929048 28 seconds
// 1E9 => 163270110 12 minutes 46 seconds

timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));


