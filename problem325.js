const assert = require('assert');
const prettyTime= require("pretty-hrtime");

require('tools/numberHelper');
require('tools/bigintHelper');

const MODULO = 7n ** 10n;
const MAX    = 10n ** 9n;

const GOLDEN_RATIO = (3+Math.sqrt(5))/2;

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

    let graph = new Array(N+1);
    let total = 0;

    graph[0] = new Array(N+1);
    graph[0].fill(' ');

    for (let x = 1; x <= N; x++)
    {
        graph[x] = new Array(N+1);
        graph[x].fill(' ');

        for (let y = x+1; y <= N; y++)
        {
            if (isLosing(x, y))
            {
                graph[x][y] = '#';
                total += (x+y);
            }
            else
            {
                graph[x][y] = '.';
            }
        }
    }
    let dots = 0;
    for (let i = graph.length-1; i > 2 ; i--)
    {
        var a = graph[i];
        if (a)
        {
            let d = a.reduce((a, v) => a += (v == '.' ? 1 : 0), 0);
            console.log(a.join(''), ':', F(i));
            dots += d;
        }
    }

    return {total, dots};
}

function S0(N, trace)
{
    // sum x = 3 .. N-1 ( sum y = x+1 .. N ( x+y) )
    const EXPECTED_STEPS = Math.ceil(Number(N) / GOLDEN_RATIO)+1;

    function evenSum(N)
    {
        let n  = N / 2n;
        return n*(n+1n);
    }

    function oddSum(N)
    {
        return (N*(N+1n) / 2n) - evenSum(N);
    }

    function *growing()
    {
        let previous = { value: 1};
        let first = { value:1 };
        let last  = first;
        let count = 1;
        let remainingSteps = EXPECTED_STEPS;

        while (true)
        {
            let l = last;

            last = previous;
            last.next = undefined;
            previous = first;

            yield first.value;
            remainingSteps--;

            if (first.value == 1)
            {
                count++;
                l.next = {value: 0, next: last};
            }
            else
            {
                l.next = last;
                previous.value = 1;
            }
            first = first.next;

            if (count >= remainingSteps)
            {
                if (trace)
                    process.stdout.write('\rLoaded enough fibonacci words\n');
                break;
            }
        }

        while (first !== undefined)
        {
            yield first.value;
            first = first.next;
        }

        throw "Ran out of value!!!!";
    }

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
            if (traceCount >= 500000)
                traceCount = 0;
        }

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
        process.stdout.write('\r       \r');

    return Number(total);
}

function S2(N, trace)
{
    let F0 = { area: 2n, width: 2n, height: 1n };
    let F1 = { area: 4n, width: 3n, height: 2n };

    let s2    = F0.area + F1.area + (F1.width* F0.height);
    let y     = 6n;
    let x     = 10n;

    while (x < N)
    {
        let F = {
            width:  F0.width  + F1.width,
            height: F0.height + F1.height,
            area:  (F0.width  * F1.height) + F0.area + F1.area
        };

        F0 = F1;
        F1 = F;

        let s = (F.width * (y-3n));
        s2 += s + F.area;

        y += F.height;
        x += F.width;
    }

    return s2;
}

function S(N, trace)
{
    N = BigInt(N);

    const s1 = ((N**3n - 2n*N**2n - 9n*N + 18n) / 2n) % MODULO;
    const s2 = S2(N, trace);

    let total;

    if (s1 < s2)
        total = s1 - s2 + Number(MODULO);
    else
        total = s1 - s2;

    return {total, dots: s2};
}

function analyse(n)
{
    const { total: total1, dots: dots1 } = bruteForce(n); // 39983
    const { total: total2, dots: dots2 } = S(n);

    assert.equal(dots2, dots1);
}

analyse(35);
analyse(56);

assert.equal(S(10), 211);
assert.equal(S(50), 28389);
assert.equal(S(10000), 230312207313n % MODULO);
assert.equal(S(1000000), 131546468);
assert.equal(S(10000000), 38318073);

process.exit(0);

let timer = process.hrtime();
let answer = S(MAX, true);

// 1E8 => 258929048 46 seconds
// 1E9 => 139748287 7 minutes 4 seconds

timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
