const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);
const MAX = 2**25;
    
const $factorial = [];

function factorial(n)
{
    if (n < 2)
        return 1;

    if (! $factorial[n])
    {
        let p = factorial(n-1);
        let v = n * p;

        if (v > Number.MAX_SAFE_INTEGER)
            v = Number((BigInt(n)*BigInt(p)) % MODULO_N);
        else
            v = v % MODULO;

        $factorial[n] = v;
    }

    return $factorial[n];
}

function getIndex(values)
{
    let used = [];
    let size = values.length;
    let index= 1;

    for(let i = 0 , remaining = size; i < size; i++, remaining--)
    {
        for(let c = 1; c < values[i]; c++)
        {
            if (! used[c])
            {
                index = (index + factorial(remaining-1)) % MODULO;
            }
        }
        used[values[i]] = 1;
    }
    return index;
}

function solve(size, trace)
{
    const tracer = new Tracer(1, trace);

    assert.equal(size & 1, 0);

    const middle = size / 2;
    const used   = [];
    const values = [];
    let   index  = undefined;

    function isGood()
    {
        for(let i = 0; i < size; i++)
        for(let j = i+1; j < size; j++)
        {
            let a = values[i];
            let b = values[j];
            let c = b + (b-a);
            if (used[c] > j)
                return false;
        }
        return true;
    }

    function canUse(digit, pos1, pos2)
    {
        let tooBig = true;

        const isBad = (a, b, c) => {
            if (c > size || c < 1)
                return false;
            if (a > size || a < 1)
                return false;
            if ((a > b && b < c) ||  (a < b && b > c))
                return false;

            tooBig = false;
            if (used[a] && used[b] && used[c])
            {
                if (used[a] < used[b] && used[b] < used[c])
                    return true;
                if (used[c] > used[b] && used[b] > used[a])
                    return true;
            }
            if (used[a] && used[b] && !used[c] && used[a] < used[b])
                return used[b] < pos2;
            if (used[c] && used[b] && !used[a] && used[c] < used[b])
                return used[b] < pos2;
            return false;
        } 

        for(let i = 1; i <= size; i++)
        {
            tooBig = true;

            if (isBad(digit, digit+i, digit+i+i))
                return false;
            if (isBad(digit, digit-i, digit-i-i))
                return false;
            if (isBad(digit-i, digit, digit+i))
                return false;

            if (tooBig)
                break;
        }

        return true;
    }

    function inner(length)
    {
        if (length === middle)
        {
            if (! isGood())
                return false;

            // console.log(size, '->', values.join(', '));
            index = getIndex(values);
            return true;
        }

        // tracer.print(_ => length);

        for(let i = 1; i <= size; i++)
        {
            if (used[i])
                continue;

            const i2 = size+1-i;

            if (used[i2])
                continue;

            // tracer.print(_ => `${length} - ${size - i}`);
            used[i2] = size-length;
            used[i] = length+1;

            if (length < 1 || canUse(i, length+1, size-length))
            {
                values[length] = i;
                values[size-1-length] = i2;
                let v = inner(length+1);
                if (v === true)
                    return true;
            }
            
            used[i] = 0;
            used[i2] = 0;
        }

        return false;
    }

    inner(0);

    tracer.clear();
    return index;
}

assert.equal(solve(4), 3);
assert.equal(solve(8), 2295);
assert.equal(solve(16), 750326372);
assert.equal(solve(32), 641839205);

console.log('Tests passed');

// const answer = timeLogger.wrap('', _ => solve(MAX, true));
const answer = timeLogger.wrap('', _ => solve(128, true));
console.log('S(128) =', answer);

