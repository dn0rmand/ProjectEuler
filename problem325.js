const assert = require('assert');
const bigNumber = require('bignumber.js');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');
require('tools/bigintHelper');

bigNumber.set({ DECIMAL_PLACES: 20 });

const MODULO = 7n ** 10n;
const MAX    = 10n ** 16n;

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
                graph[x].push(F(y));
            else
                graph[x] = [F(y)];

            total += (x+y);
        }
    }
    for (let i = 0; i < graph.length; i++)
    {
        var a = graph[i];
        if (a)
        {
            console.log(F(i)+ ':', ...a);
        }
        else
            console.log(F(i)+ ':');
    }

    // let chart = asciichart.plot(graph, { height:40 });
    // console.log(chart);
    return total;
}

function growing(callback)
{
    const FLOOR   = 3;
    const tau     = bigNumber(5).sqrt().minus(1).dividedBy(2);
    let   current = tau;

    while (1)
    {
        const previous = current;
        current = previous.plus(tau).minus(previous.integerValue(FLOOR));
        const x = current.integerValue(FLOOR).toNumber();
        if (callback(x) === false)
            break;
    }
}

function S2(N, trace)
{
    N = BigInt(N);

    let top     = 1n;
    let start   = 1n;
    let end     = N;
    let total   = 0n;
    let fullSum = (N*(N+1n))/2n;

    let traceCount = 0;

    let s1 = (end*(end+1n) - (start-1n)*start) / 2n;
    let s2 = fullSum - ((top-1n)*top)/2n;
    let sum= s1+s2;

    growing((grow) =>
    {
        if (trace === true)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${end - start}`);
            if (traceCount >= 5000)
                traceCount = 0;
        }

        sum -= start++;

        if (grow)
        {
            sum -= (top+top+1n);
            sum -= end--;
            top += 2n;

            if (start > end || top > N)
                return false;

            total = (total+sum) % MODULO;
        }
        else
        {
            sum -= top++;
            if (start > end || top > N)
                return false;
        }
    });

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

    for (let i = 0; i <= N; i++)
    {
        if (trace === true)
        {
            if (traceCount++ == 0)
                process.stdout.write(`  \r${N - i}`);
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
    }

    total = total.modDiv(2, modulo);

    if (trace)
        console.log('');

    return total;
}

let S = S2;

assert.equal(S(10), 211);
assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

let timer = process.hrtime();
let answer = S(MAX, true); // 241330676 in 2 minutes 12 seconds
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

