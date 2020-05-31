const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MODULO = 1000000007;

class SieveArray
{
    constructor(min, max)
    {
        this.min = min;
        this.max = max;
        this.size= max-min+1;
        this.array= new Uint8Array(this.size);
    }

    set(index, mask)
    {
        const i = index - this.min;
        if (i >= 0 && i < this.size)
            this.array[i] |= mask;
    }

    get(index, mask)
    {
        mask = mask || 7;
        const i = index - this.min;
        if (i >= 0 && i < this.size)
            return (this.array[i] & mask);
        else
            return 0;
    }
}

function getMaxUnreachable(values)
{
    for(let i = values.size-1; i >= 0; i--)
    {
        if (! values.get(i))
            return i;
    }

    return 0;
}

function G(p)
{
    const X = 17 ** p;
    const Y = 19 ** p;
    const Z = 23 ** p;

    const MIN = X+Y+Z;
    const MAX = 3 * (23 ** (p+2));

    let values = new SieveArray(MIN, MAX);

    const keepFilling = (start, offset, mask, callback) => {
        while(start <= MAX)
        {
            if (values.get(start, mask))
                break;

            values.set(start, mask);
            if (callback)
                callback(start);

            start += offset;
        }
    };

    for(let v1 = MIN, v2 = MIN, v3 = MIN; ; v1 += X, v2 += Y, v3 += Z)
    {
        if (v1 > MAX && v2 > MAX && v3 > MAX)
            break;

        if (v1 <= MAX)
        {
            values.set(v1, 1);
            keepFilling(v1, Y, 2, v => keepFilling(v, Z, 4));
            keepFilling(v1, Z, 4, v => keepFilling(v, Y, 2));
        }

        if (v2 <= MAX)
        {
            values.set(v2, 2);
            keepFilling(v2, X, 1, v => keepFilling(v, Z, 4));
            keepFilling(v2, Z, 4, v => keepFilling(v, X, 1));
        }

        if (v3 <= MAX)
        {
            values.set(v3, 4);
            keepFilling(v3, X, 1, v => keepFilling(v, Y, 2));
            keepFilling(v3, Y, 2, v => keepFilling(v, X, 1));
        }
    }

    let total = 0;
    const maxUnreachable = getMaxUnreachable(values);
    // console.log(maxUnreachable);
    for(let i = 1; i <= maxUnreachable; i++)
    {
        if (! values.get(i))
            total = (total + i) % MODULO;
    }

    return total;
}

function isReachable(value, p)
{
    const X = 17 ** p;
    const Y = 19 ** p;
    const Z = 23 ** p;

    const MAXA = Math.floor((value - (Y+Z)) / X);
    const MAXB = Math.floor((value - (X+Z)) / Y);
    const MAXC = Math.floor((value - (X+Y)) / Z);

    for(let a = 1; a <= MAXA; a++)
    {
        for(let b = 1; b <= MAXB; b++)
        {
            for(let c = 1; c <= MAXC; c++)
            {
                let v = a*X + b*Y + c*Z;
                if (v === value)
                {
                    console.log(`${value} = ${a} x 17^${p} + ${b} x 19^${p} + ${c} x 23^${p}`);
                }
            }
        }
    }
}

assert.equal(G(1), 8253);
assert.equal(G(2), 60258000);
assert.equal(G(3), 299868284548 % MODULO);
assert.equal(timeLogger.wrap('G(4)', _ => G(4)), 859617967);

console.log('Tests passed');

const answer = timeLogger.wrap('G(5)', _ => G(5));
console.log(`Answer is ${answer}`);