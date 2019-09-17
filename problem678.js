const assert      = require('assert');
const timeLog     = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

const MAX = 10n ** 12n;
const MAX_PRIME = 1E6;

primeHelper.initialize(MAX_PRIME, true);

const allPrimes = primeHelper.allPrimes();

const ZERO = 0n;
const ONE  = 1n;
const TWO  = 2n;
const THREE= 3n;
const FOUR = 4n;

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
    max = BigInt(max);

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
        let v = a*a*a; // a ^ 3
        if (v > max)
            break;

        for (let flag = ONE; v <= max ; flag <<= ONE, v *= a)
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

function factorize(n, callback)
{
    var max = MAX_PRIME;
    if (n < Number.MAX_SAFE_INTEGER)
    {
        let s = Math.round(Math.sqrt(Number(n)))+1;
        max = Math.max(max, s);
    }

    for (let p of allPrimes)
    {
        if (p > max)
            break;
        p = BigInt(p);
        if (p > n)
            break;
        let f = 0;

        while ((n % p) === ZERO)
        {
            n /= p;
            f++;
        }
        if (f)
        {
            if (callback(p, f) === false)
                return;
        }
    }
    if (n !== ONE)
        callback(n, 1);
}

function getSquareSumCount(C)
{
    let count = 1;

    if (C > Number.MAX_SAFE_INTEGER)
    {
        factorize(C, (p, f) => {

            if ((f & 1) && (p % FOUR) === THREE)
            {
                count = 0;
                return false;
            }
            if ((p % FOUR) === ONE)
            {
                count *= (f+1);
            }
        });
    }
    else
    {
        primeHelper.factorize(Number(C), (p, f) => {
            if ((f & 1) && (p % 4) === 3)
            {
                count = 0;
                return false;
            }
            if ((p % 4) === 1)
            {
                count *= (f+1);
            }
        });
    }
    
    if (count & 1)
        count = (count-1)/2;
    else
        count = count/2;
    // count >>= 1;

    return count;
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

        if (C === ONE || pc < ONE)
            continue; // Not a valid c^f

        let cc = getSquareSumCount(C);
        if (cc != 0)
        {
            console.log(C,'->',cc);
            total += cc;
        }
        let countC = digitCounts(pc);

        if (! countC)
            continue;

        for (let A of values)
        {
            let B = C - A;
            if (B <= A)
                break;

            let pa = map.get(A) || ZERO;
            let pb = map.get(B) || ZERO;
            let pab = pa & pb;
            if (pab)
            	total += digitCounts(pab) * countC;
        }
    }

    if (trace)
        process.stdout.write('\r           \r');

    return total;
}

function analyze()
{
    console.log(F(1E11));
    // console.log(F(1E3));
    // console.log(F(1E4));
    // console.log(F(1E5));
    // console.log(F(1E6));
    // console.log(F(1E7));
    // console.log(F(1E8));
    // console.log(F(1E9));
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
