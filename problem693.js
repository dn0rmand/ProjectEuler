const assert = require('assert');
const asciichart = require ('asciichart')

const MAX_MOD = 4000000;

const $l = [];

function initialize()
{
    for (let i = 1; i <= MAX_MOD; i++)
    {
        $l[i] = new Uint32Array(i);
    }
}

process.stdout.write('initializing ... ')
initialize();
console.log(' ... done');

function getL(a, mod)
{
    let r = $l[mod][a];
}

function setL(a, mod, value)
{
    $l[mod][a] = value;
}

function l2(a, mod, deep)
{
    if (a <= 1)
        return 1;

    if (a > Number.MAX_SAFE_INTEGER)
        throw "Too big ... "
    let r = getL(a, mod);
    if (r)
        return r;

    let count = 1;

    if (deep > 57595)
    {
        while (a > 1)
        {
            if (a > Number.MAX_SAFE_INTEGER)
                throw "Too big ... "
            count++;
            a = (a*a) % mod++
        }
    }
    else
        count += l2((a*a) % mod, mod+1, deep+1);

    setL(a, mod, count);
    return count;
}

function l(x, y)
{
    let count = l2(y, x, 1);
    return count;
}

const $g = [];

function g(x)
{
    if ($g[x])
        return $g[x];

    let max = 0;
    for (let y = 1; y < x; y++)
    {
        let v = l(x, y);
        if (v > max)
            max = v;
    }
    $g[x] = max;
    return $g[x];
}

function f(n, trace)
{
    let max = 0;
    let traceCount = 0;
    for (let x = n; x > 0; x--)
    {
        if (trace)
        {
            if (traceCount == 0)
                process.stdout.write(`\r${x} - ${MAX_MOD} - ${max} `);
            // if (++traceCount >= 100)
            //     traceCount = 0;
        }

        let value = g(x);
        if (value > max)
        {
            max  = value;
        }
    }
    if (trace)
        process.stdout.write('\r                                \r');
    return max;
}

assert.equal(l(5, 3), 29);
assert.equal(g(5), 29);

assert.equal(f(100), 145);
assert.equal(f(10000, true), 8824);

console.log('Tests passed');

answer = f(3000000, true);
console.log("Answer is", answer)
