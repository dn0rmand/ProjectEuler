// Riffle Shuffles
// ---------------
// Problem 622
// -----------
// A riffle shuffle is executed as follows: a deck of cards is split into two equal halves, with the top half taken in the
// left hand and the bottom half taken in the right hand. Next, the cards are interleaved exactly, with the top card in the
// right half inserted just after the top card in the left half, the 2nd card in the right half just after the 2nd card in the
// left half, etc. (Note that this process preserves the location of the top and bottom card of the deck)

// Let s(n) be the minimum number of consecutive riffle shuffles needed to restore a deck of size n to its original configuration,
// where n is a positive even number.

// Amazingly, a standard deck of 52 cards will first return to its original configuration after only 8 perfect shuffles, so s(52)=8.
// It can be verified that a deck of 86 cards will also return to its original configuration after exactly 8 shuffles, and the sum
// of all values of n that satisfy s(n)=8 is 412

// Find the sum of all values of n that satisfy s(n)=60

const bigInt      = require('big-integer');
const assert      = require('assert');

function *getDivisors(k)
{
    let values = [];

    function isValid(value)
    {
        let result = values.find((v) => {
            return v.mod(value).isZero();
        });

        return (result === undefined);
    }

    let value  = bigInt(2).pow(k).minus(1);

    for (let i = 1; i < k; i++)
        values.push(bigInt(2).pow(i).minus(1));

    yield value;

    let max = 2 ** (k/2);

    for (let i = 2; i < max; i++)
    {
        if (value.mod(i).isZero())
        {
            let res = value.divide(i);
            if (res.gt(i))
            {
                if (isValid(res))
                    yield res;
            }

            if (isValid(i))
                yield bigInt(i);
        }
    }
}

function solve(k)
{
    let total = bigInt.zero;

    for (let divisor of getDivisors(k))
    {
        total = total.plus(divisor).plus(1);
    }

    return total.toString();
}

assert.equal(solve(8), "412");

let result = solve(60);
console.log("Answer is", result);