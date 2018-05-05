// Binary Circles
// Problem 265 
// 2^N binary digits can be placed in a circle so that all the N-digit clockwise subsequences are distinct.

// For N=3, two such circular arrangements are possible, ignoring rotations:

// For the first arrangement, the 3-digit subsequences, in clockwise order, are:
// 000, 001, 010, 101, 011, 111, 110 and 100.

// Each circular arrangement can be encoded as a number by concatenating the binary digits starting with the subsequence 
// of all zeros as the most significant bits and proceeding clockwise. The two arrangements for N=3 are thus represented 
// as 23 and 29:

// 00010111 = 23
// 00011101 = 29
// Calling S(N) the sum of the unique numeric representations, we can see that S(3) = 23 + 29 = 52.

// Find S(5).

const assert = require('assert');

function buildNumbers(bits)
{
    let numbers = [];

    let max = Math.pow(2, bits);
    for (let value = 0; value < max; value++)
    {
        let v = value.toString(2);
        while (v.length < bits)
            v = '0'+v;
        numbers.push(v);
    }

    return numbers;
}

function *buildCircles(numbers, bits)
{
    let used = [];
    let found = {

    };

    function validate(circle)
    {
        if (! circle.endsWith(circle.substr(0, bits-1)))
            return undefined;

        circle = circle.substr(0, circle.length-bits+1);

        if (found[circle] !== undefined)
            return undefined;

        found[circle]=1;

        // Add all similar ones
        let c = circle+circle;
        for(let i = 1; i < circle.length; i++)
        {
            let c2 = c.substr(i, circle.length);
            found[c2]=1;
        }

        return circle;
    }

    function *inner(circle, count)
    {
        if (count === numbers.length)
        {
            circle = validate(circle);
            if (circle !== undefined)
            {
                let value = Number.parseInt(circle, 2);
                yield value;
            }
            return;
        }

        for(let i = 0; i < numbers.length; i++)
        {
            if (used[i] === 1)
                continue;
            let v = numbers[i];
            let valid = true;
            if (count > 0)
            {
                let end = v.substr(0, bits-1);
                valid = circle.endsWith(end);
                if (valid)
                    v = v[bits-1];
            }
            if (valid)
            {
                used[i] = 1;
                yield *inner(circle + v, count+1);
                used[i] = 0;
            }
        }
    }

    yield *inner("", 0);
}

function S(bits)
{
    let numbers = buildNumbers(bits);
    let total   = 0;

    for(let value of buildCircles(numbers, bits))
    {
        total += value;
    }

    return total;
}

//assert.equal(S(3), 52);

let result = S(5);

console.log("Answer is " + result);