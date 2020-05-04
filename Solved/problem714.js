const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX      = 50000;
const LIMIT    = 1E8;
const $memoize = [];
const $missing = new Set();

function isDuoDigit(n)
{
    let d1 = (n % 10);
    let d2 = undefined;

    while (n > 0)
    {
        let d = (n % 10);
        if (d !== d1)
        {
            if (d2 === undefined)
                d2 = d;
            else if (d !== d2)
                return false;
        }
        n = (n - d) / 10;
    }

    return true;
}

function d(n, trace)
{
    if ($memoize[n])
        return $memoize[n];

    let v = n;

    const tracer = new Tracer(100, trace);
    while (!isDuoDigit(v))
    {        
        v += n;
        if (v >= LIMIT)
        {
            $missing.add(BigInt(n));
            return 0;
        }
    }

    tracer.clear();

    $memoize[n] = v;
    return v;
}

function findMissing(trace)
{
    let cs    = [];
    let total = 0n;

    let MIN_LIMIT = BigInt(LIMIT);
    let MAX_LIMIT = 10n * MIN_LIMIT;

    let length = `${LIMIT}`.length - 1;

    const tracer = new Tracer(1, trace);
    const $found = new Map();

    function check(value, n)
    {
        if (value % n === 0n)
        {
            total += value;
            $missing.delete(n)
            tracer.print(_ => `${$missing.size} - ${length}`);
            $found.set(n, value);
        }
    }

    function inner(value)
    {
        if (value >= MIN_LIMIT && value < MAX_LIMIT)
        {
            for(let v of $missing)
            {
                check(value, v);
            }

            // replace already found if lower

            $found.forEach((v, k) => {
                if (v > value && (value % k) === 0n)
                {
                    total -= v;
                    total += value;
                    $found.set(k, value);
                }
            });
        }

        if (value < MAX_LIMIT)
        {
            inner(value*10n + cs[0]);
            inner(value*10n + cs[1]);
        }
    }

    // all the ones with only one digit

    while ($missing.size > 0)
    {
        $found.clear();
        length++;
        tracer.print(_ => `${$missing.size} - ${length}`);

        // ones with 2 different digits

        for(let c1 = 1n; c1 <= 9n; c1++)
        for(let c2 = 0n; c2 <= 9n; c2++)
        {
            if (c1 === c2)
                continue;

            cs = c2 < c1 ? [c2, c1] : [c1, c2];

            inner(c1);
        }

        MIN_LIMIT = MAX_LIMIT;
        MAX_LIMIT = MAX_LIMIT * 10n;
    }

    tracer.clear();

    return total;
}

function D(k, trace)
{
    $missing.clear();

    const tracer = new Tracer(100, trace);

    let total = 0;
    for(let n = 1; n <= k; n++)
    {
        tracer.print(_ => k-n);
        total += d(n, trace);
    }
    tracer.clear();
    total = BigInt(total);

    if ($missing.size > 0)
        total += findMissing(trace);

    if ($missing.size > 0)
        throw "ERROR";

    return total;
}

assert.equal(d(12), 12);
assert.equal(d(102), 1122);
assert.equal(d(103), 515);
assert.equal(d(317), 211122);
assert.equal(d(290), 11011010);

assert.equal(D(110), 11047);
assert.equal(D(150), 53312);
assert.equal(D(500), 29570988);

console.log('Tests passed');

let answer = timeLogger.wrap('', _ => D(MAX, true));
console.log(`Answer is ${answer} - ${ Number(answer).toExponential(12) }`);

