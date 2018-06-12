// Strong Repunits
// ---------------
// Problem 346 
// -----------
// The number 7 is special, because 7 is 111 written in base 2, and 11 written in base 6 
// (i.e. 710 = 116 = 1112). In other words, 7 is a repunit in at least two bases b > 1.

// We shall call a positive integer with this property a strong repunit. 
// It can be verified that there are 8 strong repunits below 50: {1,7,13,15,21,31,40,43}. 
// Furthermore, the sum of all strong repunits below 1000 equals 15864.

// Find the sum of all strong repunits below 10^12.

// for base b, M(n) = (b^n - 1) / (b-1) is a repunit

const assert = require('assert');
const bigInt = require('big-integer');

const MAX = 1000000000000;
const ARRAY_MAX_SIZE = 1000000000;

class myArray
{
    constructor(size)
    {        
        this.size = size;       
        this.arrays = [];
        while (size > ARRAY_MAX_SIZE)
        {
            this.arrays.push(new Int8Array(ARRAY_MAX_SIZE));
            size -= ARRAY_MAX_SIZE;
        }
        if (size > 0)
            this.arrays.push(new Int8Array(size));
    }

    set(index, value)
    {
        let idx = index % ARRAY_MAX_SIZE;
        let a   = (index - idx) / ARRAY_MAX_SIZE;

        let array = this.arrays[a];
        array[idx] = value;
    }

    get(index, value)
    {
        let idx = index % ARRAY_MAX_SIZE;
        let a   = (index - idx) / ARRAY_MAX_SIZE;

        let array = this.arrays[a];
        return array[idx];
    }
}

function M(n, b)
{
    let x = b.pow(n).minus(1);
    let y = b.minus(1);

    let v = x.divide(y);
    
    if (v.geq(MAX))
        return MAX;

    return v.valueOf();
}

function solve(max, trace)
{
    function findMaxBase()
    {
        let b = bigInt(max);

        while(true)
        {
            let v = M(2, b);
            if (v < max)
                return b.valueOf();
            b = b.prev();
        }
    }

    function *repunit(b, max)
    {
        b = bigInt(b);
        let n = 1;
        let m = 0;

        while (m < max)
        {
            m = M(n++, b);
            if (m < max)
                yield m;
        }
    }

    const MAXBASE = findMaxBase();

    let total = 0;

    function inner(min, max)
    {
        let map = new Map();

        for (let base = 2; base <= MAXBASE; base++)
        {
            for (let r of repunit(base, max))
            {
                if (r < min)
                    continue;

                let c = map.get(r);
                if (c === undefined)
                    map.set(r, 1);
                else if (c === 1)
                {
                    total += r;
                    map.set(r, 2)
                }
            }

            if (trace === true)
            {
                let percent = ((base * 100) / MAXBASE).toFixed(2);
                if (percent != $percent)
                {
                    $percent = percent;
                    console.log($percent, '%');
                }
            }
        }
    }

    let $percent = '';

    const SECTION = 10000000;

    let mmax = SECTION;
    let mmin  = 0;
    if (mmax > max)
        mmax = max;

    while (mmin < max)
    {
        inner(mmin, mmax);
        mmin = mmax;
        mmax += SECTION;
    }

    return total;
}

function solve1(max, trace)
{
    let MAXBASE = max;

    let total = 1; // 1 is a strong repunit
    let repunits = new myArray(max);

    repunits.set(1, 2);

    for(let base = 2; base < MAXBASE; base++)
    {
        let value = 1;
        while(true)
        {
            value = (value * base) + 1;
            if (value >= max)
                break;

            let c = repunits.get(value);
            if (! c)
                repunits.set(value, 1);
            else if (c === 1)
            {
                total += value;
                repunits.set(value, 2);
            }
        }
    }

    return total;
}
 
assert.equal(solve(1000), 15864);
assert.equal(solve(10000), 450740);
assert.equal(solve(100000), 12755696);
assert.equal(solve(1000000), 372810163);
assert.equal(solve(10000000), 11302817869);

console.log("Test passed");

let answer = solve(MAX, true);
console.log("Answer is", answer, 11302817869);