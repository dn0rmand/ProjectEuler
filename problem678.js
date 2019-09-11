const assert = require('assert');
const timeLog = require('tools/timeLogger');
const MAX = 10 ** 11;

if (MAX > Number.MAX_SAFE_INTEGER)
    throw "TOO BIG";

function biggy(n)
{
    if (MAX > Number.MAX_SAFE_INTEGER)
        return BigInt(n);
    else
        return n;
}

const ZERO = biggy(0);
const ONE  = biggy(1);
const TWO  = biggy(2);

const FACTOR_2 = ONE;

const TRACE_SPEED = 10000;

const $digitCount = new Map();

function digitCounts(value)
{
    let count = $digitCount.get(value);
    if (count !== undefined)
        return count;

    let v = value;

    count = 0;
    while (v !== ZERO)
    {
        if (v & ONE)
            count++;

        v >>= ONE;
    }
    $digitCount.set(value, count);
    return count;
}

function buildMap(max, trace)
{
    max = biggy(max);

    let map = new Map();

    let values = [];

    let traceCount = 0;

    for (let a = TWO; ; a++)
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${ a }`);
            if (++traceCount >= TRACE_SPEED)
                traceCount = 0;
        }
        let v = a*a;
        if (v > max)
            break;

        for (let flag = FACTOR_2; v <= max ; flag <<= ONE, v *= a)
        {
            let m = map.get(v);
            if (m === undefined)
            {
                m = flag;
                values.push(v);
            }
            else
                m |= flag;

            map.set(v, m);
        }
    }

    if (trace)
        process.stdout.write(`\r                                   \r`);

    values.sort((a, b) => {
        if (a < b)
            return -1;
        else if (a === b)
            return 0;
        else
            return 1;
    });

    return [values, map];
}

function F(N, trace)
{
    let total   = 0;
    let [values, map] = buildMap(N, trace);
    let maxValue = values[values.length-1];
    let traceCount = 0;

    let MAXFLAG = 2n**60n;

    for(let C of values)
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${ maxValue - C }    `);
            if (++traceCount >= TRACE_SPEED)
                traceCount = 0;
        }

        let pc  = map.get(C);

        if (C === ONE || pc <= 1n)
            continue; // Not a valide c^f

        pc = (pc | FACTOR_2) - FACTOR_2; // remove factor 2
        if (! pc)
            continue;

        let countC = digitCounts(pc);
        if (! countC)
            continue;

        let subCount = 0;
        for (let A of values)
        {
            let B = C - A;
            if (B <= A)
                break;

            let pa = map.get(A) || ZERO;
            let pb = map.get(B) || ZERO;
            let pab = pa & pb;
            if (! pab) // no common factors
                continue;

            let pabc = pab & pc; // count to remove
            let count = digitCounts(pab) * countC;
            
            subCount += count - digitCounts(pabc);
        }

        if (subCount != 0)
            total += subCount;
    }

    if (trace)
        console.log('\r');

    return total;
}

assert.equal(F(1E3), 7);
assert.equal(F(1E5), 53);
assert.equal(F(1E7), 287);
assert.equal(F(1E9), 1429);
// assert.equal(F(1E10), 3231);

// 1E12 -> 16066
console.log('Tests passed');

let answer = timeLog.wrap("solving 678\n", () => {
    return F(MAX, true);
});
console.log('Answer is', answer);
