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

const MAX_ARRAY_SIZE = 100000000;
const SECTION        = 10000000000;
const MAX            = 1000000000000;

class myArray
{
    constructor(min, max)
    {        
        this.min  = min;
        this.size = max-min;    
        
        this.arrays = [];
        let size = this.size;
        while (size > MAX_ARRAY_SIZE)
        {
            this.arrays.push(new Int8Array(MAX_ARRAY_SIZE));
            size -= MAX_ARRAY_SIZE;
        }
        if (size > 0)
            this.arrays.push(new Int8Array(size));
    }

    set(index, value)
    {
        if (index < this.min)
            return;

        index -= this.min;

        if (index >= 0 && index < this.size)
        {
            let idx = index % MAX_ARRAY_SIZE;
            let a   = (index - idx) / MAX_ARRAY_SIZE;
            let array = this.arrays[a];

            array[idx] = value;
        }
    }

    get(index)
    {
        if (index < this.min)
            return 0;

        index -= this.min;

        if (index >= 0 && index < this.size)
        {
            let idx = index % MAX_ARRAY_SIZE;
            let a   = (index - idx) / MAX_ARRAY_SIZE;
            let array = this.arrays[a];

            return array[idx];
        }
        else
            return 0;
    }
}

function M(n, b)
{
    // M = (b^n - 1) / (b-1)
    
    let x = b.pow(n).minus(1);
    let y = b.minus(1);

    let v = x.divide(y);
    
    if (v.geq(MAX))
        return MAX;

    return v.valueOf();
}

function $solve(max, trace)
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

    const MAXBASE = findMaxBase();

    let extra = bigInt(1); // 1 is one
    let total = 0; 

    function inner(min, max)
    {
        let map = new Map();

        for (let b = bigInt(2); b.leq(MAXBASE); b = b.next())
        {
            let n = 2;
            let m = 0;
    
            while (m < max)
            {
                m = M(n, b);

                if (m >= max)
                    break;

                n++;

                if (m < min)
                    continue;

                let c = map.get(m);
                if (c === undefined)
                    map.set(m, 1);
                else if (c === 1)
                {
                    if (Number.MAX_SAFE_INTEGER < total + m)
                    {
                        extra = extra.plus(total).plus(m);
                        total = 0;
                    }
                    else
                    {
                        total += m;
                    }
                    map.set(m, 2)
                }
            }
            if (n === 2)
                break;
        }
    }

    let $percent = '';

    let mmax = SECTION;
    let mmin  = 0;
    if (mmax > max)
        mmax = max;
    
    while (mmin < max)
    {        
        inner(mmin, mmax);
        mmin = mmax;
        mmax += SECTION;
        if (trace === true)
        {
            let p = ((mmin / max) * 100).toFixed(3);
            if (p != $percent)
            {
                $percent = p;
                console.log(">> ", p, '%');
            }
        }
    }

    return extra.plus(total).toString();
}

function solve(max, trace)
{
    let MAXBASE = max;

    let extra = bigInt(1);  // 1 is a strong repunit
    let total = 0;

    function inner(min, max)
    {
        let repunits = new myArray(min, max);

        repunits.set(1, 2);

        for(let base = 2; base < MAXBASE; base++)
        {
            let value = 1;
            let gotIn = false;
            while(true)
            {
                value = (value * base) + 1;

                if (value >= max)
                    break;
                
                gotIn = true;

                if (value < min)
                    continue;

                let c = repunits.get(value);
                if (! c)
                    repunits.set(value, 1);
                else if (c === 1)
                {
                    if(Number.MAX_SAFE_INTEGER < (total+value))
                    {
                        extra = extra.plus(total).plus(value);
                        total = 0;
                    }
                    else
                        total += value;

                    repunits.set(value, 2);
                }
            }
            if (!gotIn)
                break;
        }
    }

    let $percent = '';

    let mmax = SECTION;
    let mmin  = 0;
    if (mmax > max)
        mmax = max;
    
    while (mmin < max)
    {        
        inner(mmin, mmax);
        mmin = mmax;
        mmax += SECTION;
        if (trace === true)
        {
            let p = ((mmin / max) * 100).toFixed(0);
            if (p != $percent)
            {
                $percent = p;
                console.log(p, '%');
            }
        }
    }

    return extra.plus(total).toString();
}
 
assert.equal(solve(1000), "15864");
assert.equal(solve(10000), "450740");
assert.equal(solve(100000), "12755696");
assert.equal(solve(1000000), "372810163");
assert.equal(solve(10000000), "11302817869");

console.log("Test passed");

let answer = solve(MAX, true);
console.log("Answer is", answer, "336108797689259276");
