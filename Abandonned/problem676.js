// const assert = require('assert');
require('tools/numberHelper');

const assert = {
    equal: function(a, b)
    {
        if (a != b)
        {
            console.log(`expected ${ b } got ${ a }`)
        }
    }
}

const MODULO = (10n**16n);

function d(i, b)
{
    let sum = 0;

    while (i > 0)
    {
        let d = i % b;
        i = (i - d) / b;
        sum += d;
    }

    return sum;
}

function prepare(b1, b2)
{
    let map = {};
    let max = b1.lcm(b2);
    if (max > Number.MAX_SAFE_INTEGER)
        throw "Too big";

    for (let i = 1; i < max; i++)
    {
        let v1 = d(i, b1);
        let v2 = d(i, b2);

        let diff = v1-v2;

        let info = map[diff];
        if (info === undefined)
            map[diff] = info = { sum:0, count:0, diff: diff };

        info.sum += i;
        info.count++;
    }

    return map;
}

function bruteForceValue(value, b1, b2)
{
    let v1 = d(value, b1);
    let v2 = d(value, b2);
    if (v1 === v2)
        return value;
    else
        return 0;
}

function bruteForce(max, b1, b2)
{
    let total = 0;
    for (let i = 0; i <= max; i++)
    {
        total += bruteForceValue(i, b1, b2);
    }

    return total;
}

function M(max, b1, b2)
{
    let digits = max.toString(b1).length;
    let map   = prepare(b1, b2);
    let state = {"0": { diff:0, count:0, sum:0 }};

    let total = 0;
    let newState;

    let coef = b1;

    for (let d = 0; d < digits; d++)
    {
        newState = {};
        for (let i1 of Object.values(state))
        {
            for(let i2 of Object.values(map))
            {
                let diff = i2.diff + i1.diff;
                let i = newState[diff];
                if (i === undefined)
                    newState[diff] = i = { sum:0, diff:diff, count:1 };
                else
                    i.count++;

                i.sum += i2.sum;
                i.sum += coef*i1.sum + (i2.sum*i1.count);
            }
        }

        state = newState;

        for (let i1 of Object.values(state))
        {
            if (i1.diff === 0)
                total = i1.sum;
        }

        //coef *= b1;
    }

    // if (digits > 1)
    //     total *= 2**(digits-2);

    return total;
}

assert.equal(M(  7 , 8, 2), bruteForce(   7,  8, 2));
assert.equal(M( 63 , 8, 2), bruteForce(  63,  8, 2));
assert.equal(M(4095, 8, 2), bruteForce(4095,  8, 2));
assert.equal(M(511 , 8, 2), bruteForce( 511,  8, 2));

assert.equal(M(10 , 8, 2), 18);
assert.equal(M(100 , 8, 2), 292);
assert.equal(M(1000000 , 8, 2), 19173952);
