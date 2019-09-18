const assert      = require('assert');
const timeLog     = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

const MAX = 10n ** 18n;

primeHelper.initialize(1E8, true);

let $powers = [];

function getSquareSumCount(C, power)
{
    let count = 1;

    primeHelper.factorize(C, (p, f) =>
    {
        f *= power;
        if (f & 1 && (p % 4) === 3)
        {
            count = 0;
            return false;
        }
        if ((p % 4) === 1)
        {
            count *= (f+1);
        }
    });

    if (count)
        count >>= 1;

    return count;
}

function loadPowers(max, power)
{
    if ($powers[power])
        return $powers[power];

    power = BigInt(power);
    max   = BigInt(max);

    let map = new Set();

    for (let a = 3n; ; a++)
    {
        let A = a ** power;
        if (A > max)
            break;

        map.add(A);
    }
    $powers[power] = map;
    return map;
}

function F(N, trace)
{
    // Clear memoize
    $powers = [];
    $memoize= new Map();

    N = BigInt(N);

    let total = 0;
    let traceCount = 0;

    for (let pc = 3; ; pc++)
    {
        if (2n ** BigInt(pc) > N)
            break;

        for (let c = 2; ; c++)
        {
            let C = BigInt(c) ** BigInt(pc);
            if (C > N)
                break;

            if (trace)
            {
                if (traceCount++ == 0)
                {
                    process.stdout.write(`\r${pc} - ${N - C}   `);
                }
                if (traceCount > 1000)
                    traceCount = 0;
            }
            let subTotal = $memoize.get(C);
            if (subTotal)
            {
                total += subTotal;
                continue;
            }

            subTotal = getSquareSumCount(c, pc);

            let middle = C/2n;
            for (let pa = 3; ; pa++)
            {
                if (pa === pc)
                    continue;
                let PA = BigInt(pa);
                if ((2n ** PA) > middle)
                    break;

                let powers = loadPowers(N, pa);

                for (let a = 2n; ; a++)
                {
                    let A = a ** PA;
                    let B = C - A;
                    if (B <= A)
                        break;
                    if (powers.has(B))
                        subTotal++;
                }
            }

            $memoize.set(C, subTotal);
            total += subTotal;
        }
    }

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
    console.log(F(1E11));
}

function runTests()
{
    assert.equal(F(1E3), 7);
    assert.equal(F(1E5), 53);
    assert.equal(F(1E7), 287);
    console.log('Tests passed');
}

// analyze();
runTests();

let answer = timeLog.wrap("", () => {
    return F(MAX, true);
});
console.log('Answer is', answer);
