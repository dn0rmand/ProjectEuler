const assert = require('assert');
const announce = require('../tools/announce');

function *generateSequence(a)
{
    while(a !== 1)
    {
        if (a % 3 === 0)
        {
            a = a / 3;
            yield 'D';
        }
        else if (a % 3 === 1)
        {
            a = (4*a + 2) / 3;
            yield 'U';
        }
        else if (a % 3 === 2)
        {
            a = (2*a - 1) / 3;
            yield 'd';
        }
    }
}

function reverse(value, sequence)
{
    for(let i = sequence.length; i > 0; i--)
    {
        switch (sequence[i-1])
        {
            case 'D':
                value *= 3;
                if (value % 3 !== 0)
                    return 0;
                break;

            case 'U':
                value = (3*value - 2)/4;
                if (value % 3 !== 1)
                    return 0;
                break;

            case 'd':
                value = (3*value + 1) / 2;
                if (value % 3 !== 2)
                    return 0;
                break;
        }
    }

    return value;
}

function forceApply(value, sequence)
{
    for(let c of sequence)
    {
        switch (c)
        {
            case 'D':
                while (value % 3 !== 0)
                    value--;
                value /= 3;
                break;

            case 'U':
                while (value % 3 !== 1)
                    value--;
                value = (4*value+2)/3;
                break;

            case 'd':
                while (value % 3 !== 2)
                    value--;
                value = (2*value-1)/3;
                break;
        }
    }

    return value;
}

function validate(a1, sequence)
{
    let index = 0;

    for (let s of generateSequence(a1))
    {
        if (sequence[index] !== s)
            return false;
        index++;
        if (index >= sequence.length)
            break;
    }

    return true;
}

assert.equal(validate(231, "DdDddUUdDD"), true);
assert.equal(validate(1004064, "DdDddUUdDDDdUDUUUdDdUUDDDUdDD"), true);

const SEQUENCE = "UDDDUdddDDUDDddDdDddDDUDDdUUDd";
const TARGET   = 1000000000000000;

// Apply the Sequence to 10^15 to get a starting point
let current = forceApply(TARGET, SEQUENCE);

// Now find it by applying the reverse of the transformation
// until we find a valid one
while(true)
{
    let value = reverse(current, SEQUENCE);
    if (value >= TARGET && validate(value, SEQUENCE))
    {
        announce(277, "The smallest a1 > 10^15 that begins with the sequence UDDDUdddDDUDDddDdDddDDUDDdUUDd is " + value);
        break;
    }

    current++;
}

console.log("Done");
