// Pandigital Fibonacci ends
// Problem 104 
// The Fibonacci sequence is defined by the recurrence relation:

// Fn = Fn−1 + Fn−2, where F1 = 1 and F2 = 1.
// It turns out that F541, which contains 113 digits, is the first Fibonacci number for which the last nine digits 
// are 1-9 pandigital (contain all the digits 1 to 9, but not necessarily in order). 
// And F2749, which contains 575 digits, is the first Fibonacci number for which the first nine digits are 1-9 pandigital.

// Given that Fk is the first Fibonacci number for which the first nine digits AND the last nine digits are 1-9 pandigital, 
// find k.

const bigInt = require('big-integer');
const assert = require('assert');

function *Fibonacci()
{
    yield bigInt(1);
    yield bigInt(1);

    let f1 = bigInt(1);
    let f2 = bigInt(1);
    let f  = bigInt(2);

    while(true)
    {
        f = f1.plus(f2);
        f1 = f2;
        f2 = f;

        yield f;
    }
}

function pandigitalEnd(f)
{
    let digits = [0,0,0,0,0,0,0,0,0,0];
    let v1 = f.value[0];
    let v2 = f.value[1];

    let d = (v2 % 10);
    digits[d]++;
    d = ((v2 - d) / 10) % 10;
    if (digits[d]++ !== 0)
        return false;
    
    while (v1 > 0)
    {
        d = v1 % 10;
        if (digits[d]++ !== 0)
            return false;
        v1 = (v1 - d) / 10;
    }

    for (let i = 1; i < 10; i++)
        if (digits[i] !== 1)
            return false;

    return true;
}

function pandigitalStart(f)
{
    let idx   = f.value.length-1;
    let v1 = f.value[idx--];
    let v2 = f.value[idx--];
    let v3 = f.value[idx];

    let s = v1.toString()+v2.toString()+v3.toString();
    s = s.substring(0, 9).split('').sort().join('');

    return s === '123456789';  
}

let n = 0;

for (let f of Fibonacci())
{
    n++;
    if (n === 541)
    {
        assert.equal(pandigitalEnd(f), true);
    }
    else if (n === 2749)
    {
        assert.equal(pandigitalStart(f), true);
        assert.equal(pandigitalEnd(f), false);
    }
    else if (n > 2749)
    {
        if (pandigitalEnd(f))
        {
            if (pandigitalStart(f))
            {
                console.log("Answer to problem 104 is", n);
                break;
            }
        }
    }
}