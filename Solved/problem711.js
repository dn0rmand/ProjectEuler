const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1000000007;
const MAX    = 12345678;

const bitCount = [];

function populateBitCount(max)
{
    function countBits(value)
    {
        let bits = 0;
        while (value > 0)
        {
            if (value & 1)
            {
                bits++;
                value--;
            }
            value /= 2;
        }
        return bits;
    }

    for(let i = bitCount.length; i <= max; i++)
    {
        bitCount[i] = countBits(i);
    }
}

function s(n)
{
    populateBitCount(n);

    const $o = [[] , []];
    const $e = [[] , []];

    function oscarCanWin(remaining, bits)
    {
        if (remaining === 0)
            return bits === 1;

        if ($o[bits][remaining] !== undefined)
            return $o[bits][remaining];

        for(let i = 1; i <= remaining; i++)
        {            
            if (! ericAlwaysWin(remaining-i, (bits + bitCount[i]) & 1))
            {
                $o[bits][remaining] = true;
                return true;
            }
        }

        $o[bits][remaining] = false;
        return false;
    }

    function ericAlwaysWin(remaining, bits)
    {
        if (remaining === 0)
            return bits === 0;

        if ($e[bits][remaining] !== undefined)
            return $e[bits][remaining];

        for(let i = 1; i <= remaining; i++)
        {
            if (! oscarCanWin(remaining-i, (bits + bitCount[i]) & 1))
            {
                $e[bits][remaining] = true;
                return true;
            }
        }

        $e[bits][remaining] = false;
        return false;
    }

    let result = ! oscarCanWin(n, bitCount[n] & 1);

    return result;
}

function S(n, trace)
{
    const ZERO= Number(0);
    const ONE = Number(1);
    const TWO = Number(2);

    let total = ONE;

    let itemsCount = ZERO;
    let currentSum = ZERO;

    function addRange(start, end)
    {
        if (start !== undefined)
        {
            if (itemsCount > ZERO)
            {
                let count  = itemsCount-ONE;
                let extra  = start.modMul(count, MODULO) + currentSum - (start - ONE);

                total      = (total + extra);
                currentSum = (currentSum + extra);
                itemsCount = itemsCount + count;
            }

            currentSum  = (currentSum + start);
            itemsCount  = (itemsCount + ONE);

            total = (total + start);

        }
        else
        {
            currentSum  = (currentSum + end);
            itemsCount += ONE;
        }

        total += end;

        if (itemsCount >= MODULO)
            itemsCount %= MODULO;

        if (currentSum >= MODULO)
            currentSum %= MODULO;

        if (total >= MODULO)
            total %= MODULO;
    }

    const tracer = new Tracer(50000, trace);

    let start = TWO;
    let odd   = true;

    for(let i = ONE; i < n; i++)
    {
        tracer.print(_ => n-i);

        end = TWO*start - ONE;
        if (end >= MODULO)
            end %= MODULO;

        if (odd)
            addRange(undefined, end);
        else
            addRange(start, end);

        start = end + ONE;
        odd = !odd;
    }

    if ((n & ONE) === ZERO)
        total += start;

    tracer.clear();

    return Number(total % MODULO);
}

assert.equal(s(1),  true);
assert.equal(s(3),  true);
assert.equal(s(4),  true);
assert.equal(s(7),  true);
assert.equal(s(15), true);

assert.equal(s(2),  false);
assert.equal(s(5),  false);
assert.equal(s(6),  false);

assert.equal(S(4), 46);
assert.equal(S(12), 54532);
assert.equal(S(1234), 690421393);

console.log('Tests passed');

const answer = timeLogger.wrap('Solving', _ => S(MAX, true));
console.log(`Answer is ${answer}`);