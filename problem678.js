const assert = require('assert');
const timeLog = require('tools/timeLogger');
const MAX = 10 ** 11;

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

const TRACE_SPEED = 1000;

function digitCounts(value)
{
    let v = value;

    count = 0;
    while (v !== ZERO)
    {
        if (v & ONE)
            count++;

        v >>= ONE;
    }
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
            continue; // Not a valid c^f

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

            subCount+= digitCounts(pab) * countC;
        }

        if (subCount != 0)
            total += subCount;
    }

    if (trace)
        process.stdout.write('\r           \r');

    return total;
}

function analyze()
{
    console.log(F(1E3));
    console.log(F(1E4));
    console.log(F(1E5));
    console.log(F(1E6));
    console.log(F(1E7));
    console.log(F(1E8));
    console.log(F(1E9));
}

function runTests()
{
    assert.equal(F(1E3), 7);
    assert.equal(F(1E5), 53);
    assert.equal(F(1E7), 287);
    assert.equal(F(1E9), 1429);
    assert.equal(F(1E10), 3231);

    // 1E12 -> 16066
    console.log('Tests passed');
}

// analyze();
runTests();

let answer = timeLog.wrap("", () => {
    return F(MAX, true);
});
console.log('Answer is', answer);

/*

 2^2 + 11^2 =  5^3 - 1
 5^2 + 10^2 =  5^3 - 1
 3^3 +  6^3 =  3^5 - 1
 7^2 + 24^2 =  5^4 - 1
15^2 + 20^2 =  5^4 - 1
10^2 + 30^2 = 10^3 - 1
18^2 + 26^2 = 10^3 - 1
 9^2 + 46^2 = 13^3 - 1
26^2 + 39^2 = 13^3 - 1
10^2 + 55^2 =  5^5 - 1
25^2 + 50^2 =  5^5 - 1
38^2 + 41^2 =  5^5 - 1
17^2 + 68^2 = 17^3 - 1
47^2 + 52^2 = 17^3 - 1

 9^3 + 18^3 =  9^4
 9^3 + 18^3 =  3^8

16^2 + 88^2 = 20^3 - 1
40^2 + 80^2 = 20^3 - 1
28^2 + 96^2 = 10^4 - 1
60^2 + 80^2 = 10^4 - 1


35^2 + 120^2 = 25^3
             = 5^6 - 2


1936 + 13689 = 15625 - 2 ( 5^6 or 25^3)
5625 + 10000 = 15625 - 2

*/