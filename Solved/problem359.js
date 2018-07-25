// Hilbert's New Hotel
// -------------------
// Problem 359 
// -----------
// An infinite number of people (numbered 1, 2, 3, etc.) are lined up to get a room at Hilbert's 
// newest infinite hotel. The hotel contains an infinite number of floors (numbered 1, 2, 3, etc.), 
// and each floor contains an infinite number of rooms (numbered 1, 2, 3, etc.).

// Initially the hotel is empty. Hilbert declares a rule on how the nth person is assigned a room: 
// person n gets the first vacant room in the lowest numbered floor satisfying either of the following:

// the floor is empty
// the floor is not empty, and if the latest person taking a room in that floor is person m, then m + n is 
// a perfect square
// Person 1 gets room 1 in floor 1 since floor 1 is empty. 
// Person 2 does not get room 2 in floor 1 since 1 + 2 = 3 is not a perfect square. 
// Person 2 instead gets room 1 in floor 2 since floor 2 is empty. 
// Person 3 gets room 2 in floor 1 since 1 + 3 = 4 is a perfect square.

// Eventually, every person in the line gets a room in the hotel.

// Define P(f, r) to be n if person n occupies room r in floor f, and 0 if no person occupies the room. 
// Here are a few examples: 
// P(1, 1) = 1 
// P(1, 2) = 3 
// P(2, 1) = 2 
// P(10, 20) = 440 
// P(25, 75) = 4863 
// P(99, 100) = 19454

// Find the sum of all P(f, r) for all positive f and r such that f × r = 71328803586048 and 
// give the last 8 digits as your answer.

const bigInt = require('big-integer');
const assert = require('assert');
const floors = [];

function P(f, r, modulo)
{
    function get2ndValue()
    {
        let floor = f+r-1;
        let result;

        if ((floor & 1) === 1)
        {
            let x = floor+1;
            let v = bigInt(x).square().divide(2);
            result = v.minus(1);
        }
        else
        {
            let x = floor-1;
            let v = bigInt(x).square().divide(2);
            result = v.plus(1);
        }

        // console.log(floor-1,2,'->',result);
        return result;
    }

    function get(f, r)
    {
        if (f === 1)
        {
            // Special case
            if (r === 1)
                return bigInt.one;

            let z = get(f+1, r-1);
            if (((f+r) & 1) === 0)
                return z.minus(1);
            else
                return z.plus(1);
        }

        let x = f+r-1;

        if (((f+r) & 1) === 0) // Even then going down, but what's the first one?
        {
            if ((r & 1) === 1)
            {
                let offset = (r-1) / 2;
                let v = bigInt(x).square().divide(2);
                return v.minus(offset);
            }
            else
            {
                let offset = (r / 2)-1;
                return get2ndValue().minus(offset); // Need to determine the 2nd value :(
            }
        }
        else // Odd then going up
        {
            if ((r & 1) === 1)
            {
                let offset = (r-1) / 2;
                let v = bigInt(x).square().divide(2);
                return v.plus(offset);
            }
            else
            {
                let offset = (r / 2)-1;
                return get2ndValue().plus(offset); // Need to determine the 2nd value :(
            }
        }
    }

    let v = get(f, r);

    if (modulo !== undefined)
        v = v.mod(modulo);
    // console.log(f,',',r,'->',v);
    return v.valueOf();
}

function TEST()
{
    function $P(f, r)
    {
        let floor = floors[f];
        if (floor === undefined)
            return 0;
        let n = floor[r];
        if (n === undefined)
            return 0;
        return n;
    }

    function getRoom(n)
    {
        for (let i = 1; ; i++)
        {
            let floor = floors[i];
            if (floor === undefined)
            {
                floors[i] = [0, n];
                break;
            }
            else
            {
                let m = floor[floor.length-1];
                let r = Math.sqrt(m+n);
                if (r === Math.floor(r))
                {
                    floor.push(n);
                    break;
                }
            }
        }
    }

    function fill(max)
    {
        for (let i = 1; i < max; i++)
            getRoom(i);
    }

    fill(30000);

    assert.equal(P(1, 1), 1);
    assert.equal(P(1, 2), 3); 
    assert.equal(P(2, 1), 2); 
    assert.equal(P(10, 20), 440); 
    assert.equal(P(25, 75), 4863); 
    assert.equal(P(99, 100), 19454);

    assert.equal(P(1, 18), 171);

    for (let c = 0; c < 100; c++)
    {
        let f = Math.floor(Math.random() * 100);
        let r = Math.floor(Math.random() * 100);
        if (f < 1)
            f = 1;
        if (r < 1)
            r = 1;

        let n1 = P(f, r);
        let n2 = $P(f, r);

        assert.equal(n1, n2);
    }

    console.log('All Test Passed');
}

function solve(max, modulo)
{
    let m = Math.floor(Math.sqrt(max));

    let total = 0;
    for (let x = 1; x <= m; x++)
    {
        if ((max % x) === 0)
        {
            let v1 = x;
            let v2 = max / x;

            let x1 = P(v1, v2, modulo);
            let x2 = P(v2, v1, modulo);

            total = (total + x1) % modulo;
            total = (total + x2) % modulo;
        }
    }

    console.log('Answer is', total);
}

TEST();
solve(71328803586048, 100000000);