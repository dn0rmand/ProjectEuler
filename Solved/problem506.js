const assert   = require('assert');
const timeLog  = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MODULO   = 123454321n;
const MAX      = 10n ** 14n;

function *sequence()
{
    const $sequence = [1n, 2n, 3n, 4n, 3n, 2n];

    let index = 0;
    let values= [];
    let sum   = 0n;

    let n = 1n;
    while (true)
    {
        const v = $sequence[index];
        values.push(v);
        sum += v;
        while (sum > n)
            sum -= values.shift();
        index = (index + 1) % $sequence.length;

        if (sum === n)
        {
            yield values.reduce((a, v) => (a * 10n + v) /*% MODULO*/, 0n);
            values = [];
            sum = 0n;
            n++;
        }
    }
}

function v(n)
{
    n = BigInt(n);

    let i = 0n;
    for(let v of sequence())
    {
        i++;
        if (i === n)
            return Number(v);
    }
}

function S(n, noModulo)
{
    n = BigInt(n);
    let total = 0n;

    let i = 0n;
    for(let v of sequence())
    {
        total = (total + v) /*% MODULO*/;
        i++;
        if (i === n)
            break;
    }

    if (noModulo !== true)
        total %= MODULO;

    return total;
}

function solveIt(max, trace)
{
    if (max < 100)
        return S(max) % MODULO;

    max = BigInt(max);

    let start    = (max % 15n)+30n;
    let total    = S(start, true);// % MODULO;

    const STEP   = 55555n*15n;
    const JUMP   = 3429239196154n % MODULO; 

    let current  = total - S(start-15n, true);

    assert.equal(current % 1000n, 97n);
    current = (current-97n) / 1000n;
    let previous = -1n;
    let jump     = -1n;
    let i,  j;

    for(i = start, j = 0n; i < max; i += 15n, j += 15n)
    {
        if (trace)
            process.stdout.write(`\r${max-i}   `);

        if (j && j % STEP === 0n)
        {
            if (previous != current)
            {
                previous = current;
                jump     = total;
            }
            else if (i + STEP < max)
            {
                jump = total - jump;
                while (jump < 0)
                    jump += MODULO;

                let traceCount = 0;
                while(i + STEP < max)
                {
                    if(trace)
                    {
                        if (traceCount === 0)
                            process.stdout.write(`\r${max-i}   `);
                        if (++traceCount > 100)
                            traceCount = 0;
                    }
                    total = (total + jump) % MODULO;
                    i += STEP;
                    j += STEP;
                }
            }
        }

        current = ((current * 1000000n) + 101232n) % MODULO;
        const offset = (current * 1000n + 97n);
        total = (total + offset) % MODULO;
    }

    if (trace)
        process.stdout.write('\r                   \r');
    if (i !== max)
        throw "NOT SUPPORTED";

    return total;
}

function analyze()
{
    for(let start = 1; start <= 15; start++)
    {
        console.log(`S(${start}) = ${S(start, true)}`);
        for(let i = 0; i < 5; i++)
        {
            let i1 = i*15 + start;
            let i2 = i1+15;
            console.log(`S(${i2})-S(${i1}) = ${S(i2, true)-S(i1, true)}`);
        }
        console.log('');    
    }
}

// analyze();

assert.equal(v(2), 2);
assert.equal(v(5), 32);
assert.equal(v(11), 32123);

assert.equal(S(11), 36120);
assert.equal(S(1000), 18232686);
assert.equal(solveIt(1000), 18232686);
assert.equal(solveIt(3000), S(3000));

console.log('Tests passed');

const answer = timeLog.wrap('', () => solveIt(MAX, true));
console.log(`Answer is ${answer}`);