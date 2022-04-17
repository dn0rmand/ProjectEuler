const assert = require('assert');
const timerLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

function solve2(maxPower, R)
{
    const $inner = [0n];

    function inner(power, R)
    {
        if (power <= 0)
            return (R*(R+1n))/2n

        if ($inner[power] !== undefined)
            return $inner[power];

        let value  = inner(power-1n, 7n);

        let total  = 0n;
        for(let x = 0n; x < R; x++)
        {
            total += x*value + value;
        }

        $inner[power] = total;
        return total;
    }

    let count = inner(BigInt(maxPower), BigInt(R));

    return count;
}

function solve(rows, trace)
{
    let factors   = new Array(11); // 1E9 is less than 7**11 and more than 7**10
    factors.fill(0);

    let maxPower = 10;
    while(maxPower > 1 && 7**maxPower > rows)
        maxPower--;

    let start = 0;
    let count = 0n;
    let offset= 1n;

    if (maxPower > 1)
    {
        start = 7**maxPower;
        let R = 6;
        while (R*start > rows)
            R--;

        count = solve2(maxPower, R);

        start *= R;
        factors[maxPower] = R;
        offset = BigInt(R+1);
    }

    let rowCount  = 0n;
    let traceCount= 0;

    for (let row = start; row < rows; row++)
    {
        if (trace)
        {
            if (traceCount == 0)
                process.stdout.write(`\r${ rows - row }  `);
            traceCount++;
            if (traceCount >= 1000)
                traceCount = 0;
        }

        rowCount += offset;
        count += rowCount;

        if (factors[0] == 6)
        {
            factors[0] = 0;
            for(let i = 1; i < factors.length; i++)
            {
                if (factors[i] == 6)
                {
                    factors[i] = 0;
                }
                else
                {
                    factors[i]++;
                    break;
                }
            }

            rowCount = 0n;
            offset = 1n;
            for (let i = 1; i < factors.length; i++)
            {
                offset *= BigInt(factors[i]+1);
            }
        }
        else
            factors[0]++;
    }

    return count;
}

function brute(rows)
{
    let r = [1n,1n];
    let count = 3n;

    for (let row = 2; row < rows; row++)
    {
        let r2 = [1n];
        for(let col = 0; col < r.length-1; col++)
        {
            let v = r[col] + r[col+1];

            r2.push(v);
            if (v % 7n !== 0n)
                count++;
        }
        r2.push(1n);
        count += 2n;
        r = r2;
    }

    return count;
}

function tests()
{
    assert.equal(solve(7**4), 614656n);
    assert.equal(solve(7**3), 21952n);
    assert.equal(solve(7**2), 784n);

    assert.equal(solve(120), brute(120));
    assert.equal(solve(1000), brute(1000));
}

tests();

let answer = timerLog.wrap('', () => { return solve(1E9, true); });
console.log(`Answer is ${answer}`);