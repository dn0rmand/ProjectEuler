const assert = require("assert");
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 10n ** 16n;

const $factorials = [];

function factorial(n)
{
    if (n < 2)
        return 1n;
    let result = $factorials[n];
    if (result !== undefined)
        return result;

    result = BigInt(n) * factorial(n-1);
    $factorials[n] = result;
    return result;
}

function nCr(n, r)
{
    const top = factorial(n);
    const bottom = factorial(r) * factorial(n-r);

    return top / bottom;
}

function g(n, m)
{
    let value = nCr(n, m);
    let k     = 0;

    while (value % 2n === 0n)
    {
        k++;
        value /= 2n;
    }
    return k;
}

function F(n)
{
    let max = 0;
    for(let m = 0; m <= n; m++)
    {
        const k = g(n, m);
        max = Math.max(k, max);
    }
    return max;
}

function S(n)
{
    n = BigInt(n);

    function getClosest(value)
    {
        let total = 2n;

        while (total < value)
            total *= 2n;

        return total / 2n;
    }

    let total     = 0n;
    let count     = 0n;
    let size      = 1n;
    let step      = 0n;
    let length    = 1n;

    const values = new Map();

    while(length < n)
    {
        values.set(size, { step, count });

        step++;

        const l = size * 2n;

        if (length + l <= n)
        {
            count  = (2n * (count + size)) - 1n;
            size = l;
            total    += count;

            length += l;
        }
        else
        {
            if (length + size <= n)
            {
                total  += (count + size);
                length += size;
            }
            break;
        }
    }

    let remainder = n - length;
    
    while (remainder > 0n)
    {
        if (remainder === 1n)
        {
            total     += step;
            remainder -= 1n;
        }
        else
        {
            const length = getClosest(remainder);
            const row    = values.get(length);

            total += row.count + length * (step - row.step);

            remainder -= length; 
        }
    }

    return total;
}

assert.equal(g(12, 5), 3);
assert.equal(F(10), 3);
assert.equal(F(100), 6);
assert.equal(S(100), 389);
assert.equal(S(10n**7n), 203222840);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => S(MAX));

console.log(`Answer is ${answer}`);

