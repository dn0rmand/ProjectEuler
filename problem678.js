const assert      = require('assert');
const timeLog     = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

const MAX = 10 ** 12;
// primeHelper.initialize(1E9, true);

// const allPrimes = primeHelper.allPrimes();

function loadSquares(max)
{
    process.stdout.write(' Allocating array ..');
    let result = [];
    for(let i = 0; i < 1E8; i++)
        result[i] = 0;
    console.log(' Done');
    let count = 0;
    let isBig = false;
    let c = 0;

    for (let a = 2; ; a++)
    {
        let A = a*a;
        if (A > max)
            break;

        if (c === 0)
        {
            if (isBig)
                process.stdout.write(`\r*${ max - A }   `);
            else
                process.stdout.write(`\r${ max - BigInt(A) }   `);
        }
        c++;
        if (c > 1000000)
            c = 0;

        if (! isBig && A > Number.MAX_SAFE_INTEGER)
        {
            isBig = true;
            a = BigInt(a);
            A = a*a;
        }

        // result[count] = A;
        count++;
    }

    console.log(count, 'cubes');
    return result;
}

timeLog.wrap('Squares', () => {
    loadSquares(10n ** 18n);
});
process.exit(0);

function generateC(max)
{
    function inner(index, value, $gcd)
    {
        for(let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * (p ** 3);
            if (v > max)
                break;

            while (v <= max)
            {

            }
        }
    }

    inner(0, 1);
}

function gcd(a, b)
{
    if (a < b)
        [a, b] = [b, a];

    while (b !== ZERO)
    {
        let c = a % b;
        a = b;
        b = c;
    }
    return a;
}

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

function factorize(value, squares)
{
    let result = '';
    let pf = 0;
    primeHelper.factorize(value, (a, f) => {
        if (result != '')
            result += '*'

        if (squares)
        {
            while (f > 2 && (f & 1)==0)
            {
                let k = f / 2;
                f /= k;

                a = a ** k;
            }
            if (f !== 2)
                console.log('error - not square');
        }
        else
        {
            if (! pf)
                pf = f;
            else if (pf != f)
            {
                let x = gcd(pf, f);
                if (x < 3)
                    result = '!'+result;
                else
                    pf = x;
            }
        }

        result += `${a}^${f}`;
    });
    return result;
}

function F(N, trace)
{
    let total   = 0;
    let [values, map] = buildMap(N, trace);
    let maxValue = values[values.length-1];
    let traceCount = 0;

    let primitives = new Set();

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

            let t = digitCounts(pab) * countC;
/*
            if (t != 0)
            {
                let v1 = gcd(A, B);
                let v2 = gcd(A, C);
                let v3 = gcd(B, C);

                if (v1 === ONE)
                {
                    if (v2 !== ONE || v3 !== ONE)
                    {
                        console.log(`${A} + ${B} = ${C} - ${v1}, ${v2}, ${v3}`);
                    }
                    else
                    {
                        let AA = factorize(A, true);
                        let BB = factorize(B, true);
                        let CC = factorize(C, false);

                        let k = `${CC} = ${AA} + ${BB}`;
                        if (! primitives.has(k))
                        {
                            primitives.add(k);
                            if (k[0] == '!')
                                console.log(k);
                        }
                    }
                }
                else if (v2 !== v1)
                {
                    console.log(`${A} + ${B} = ${C} - ${v1}, ${v2}, ${v3}`);
                }
                else if (v3 !== v1)
                {
                    console.log(`${A} + ${B} = ${C} - ${v1}, ${v2}, ${v3}`);
                }
            }
*/
            subCount += t;
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
    // assert.equal(F(1E9), 1429);
    // assert.equal(F(1E10), 3231);

    // 1E12 -> 16066
    console.log('Tests passed');
}

analyze();
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