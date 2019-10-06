const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const divisors = require('tools/divisors');
const timeLogger = require('tools/timeLogger');
const announce = require('tools/announce');

const MAX = 1e6;
primeHelper.initialize(MAX);

const $divisors = [];

function getDivisors(n)
{
    if ($divisors[n])
        return $divisors[n];

    let ds = [];
    divisors(n, primeHelper.isKnownPrime, (d) =>
    {
        ds.push(d);
    });
    ds.sort((a, b) => a-b);
    $divisors[n] = ds;
    return ds;
}

getDivisors(MAX*MAX);

function SP(n, trace)
{
    function isSquare(n)
    {
        let x = Math.round(Math.sqrt(n));
        return (x*x == n)
    }

    function isValid(D, C, B, A)
    {
        let a = (B+C+D-A);
        let b = (A+C+D-B);
        let c = (A+B+D-C);
        let d = (A+B+C-D);

        if (a <= 0 || b <= 0 || c <= 0 || d <= 0)
            return false;
        if ((a & 1) || (b & 1) || (c & 1) || (d & 1))
            return false;
            
        return true;
    }

    function sp(n)
    {
        let total= 0;

        let td = n*n;
        for(let d of getDivisors(td))
        {
            let tc = td / d;
            for(let c of getDivisors(tc))
            {
                if (c > d) break;

                let tb = tc / c;

                for(let b of getDivisors(tb))
                {
                    if (b > c) break;

                    let a = tb / b;

                    if (a <= b && isValid(a, b, c, d))
                    {
                        total += a+b+c+d;
                    }
                }
            }
        }

        return total;
    }

    let total = 0;
    let traceCount = 0;
    for (let area = 1; area <= n; area++)
    {
        if (trace)
        {
            if (traceCount++ == 0)
                process.stdout.write(`\r${area}`);
            if (traceCount >= 1000)
                traceCount = 0;
        }
        total += sp(area);
    }
    if (trace)
        console.log(`\r${n}`);
    return total;
}

assert.equal(SP(10), 186);
assert.equal(SP(100), 23238);
assert.equal(SP(1000), 2603226);
assert.equal(SP(10000), 271512946);

console.log('End of tests');

//1E5 => 26927556378

let answer = timeLogger.wrap('', () => {
    return SP(MAX, true);
});
console.log(`Answer for ${MAX} is ${answer}`);
announce(681, `Answer is ${answer}`);