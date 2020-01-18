const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const BigNumber = require('bignumber.js');

const MAX = 1E9;

BigNumber.set({ DECIMAL_PLACES: 20 });

function SQRT1(a)
{
    // return BigNumber(a).sqrt().integerValue().toNumber()+1;
    return Math.floor(Math.sqrt(Number(a))) + 1;
}

function SQRT2(a)
{
    // let A = BigNumber(a).sqrt().integerValue().toNumber();
    let A = Math.floor(Math.sqrt(Number(a))) + 1;
    A = BigInt(A) + 1n;
    while (A > 0 && A*A >= a)
        A--;
    return A;
}

function solve(N, trace)
{
    assert.equal(N % 4, 0);

    const belowDiagonal = BigInt(N)*BigInt(N);
    const aboveDiagonal = belowDiagonal / 2n;
    let   insideCircle    = 0n;

    if (N % 8 === 0)
    {
        const C     = N/4;
        const r2    = belowDiagonal / 32n;
        const r     = SQRT1(r2);

        let traceCount = 0;

        for (let x = r; x >= 0; x--)
        {
            if (trace)
            {
                if (traceCount == 0)
                    process.stdout.write(`\r${x}  `);
                if (++traceCount >= 10000)
                    traceCount = 0;
            }

            const xx  = BigInt(x)*BigInt(x);
            const maxYY = r2 - xx;

            if (maxYY <= 0)
                continue;

            const maxY = SQRT2(maxYY);

            // assert.equal((maxY*maxY + xx) < r2, true);

            const add = maxY+maxY+1n;

            insideCircle += add;
            if (x !== 0)
                insideCircle += add;
        }
        insideCircle -= BigInt(C-1);
    }
    if (trace)
        process.stdout.write('\r                        \r');

    const total = insideCircle + belowDiagonal + aboveDiagonal;

    return total;
}

assert.equal(solve(4), 24);
assert.equal(solve(8), 100);
assert.equal(solve(24), 916);
assert.equal(solve(40), 2540);
assert.equal(solve(1000), 1597880);
console.log('Tests passed');

const answer = timeLogger.wrap('', () => solve(MAX, true));
console.log(`N(${MAX})=${answer}`);