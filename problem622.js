// Riffle Shuffles

const bigInt = require('big-integer');
const assert = require('assert');

let max = bigInt(2).pow(60);

function s(n)
{
    let position = bigInt(1);
    let count = 0;

    do
    {
        if (count >= 60)
            return 61;

        count++;
        position = position.shiftLeft(1);
        if (position.geq(n))
            position = position.mod(n).next();
    }
    while (! position.eq(1))

    return count;
}

assert.equal(s(18), 8);
assert.equal(s(52), 8);
assert.equal(s(86), 8);
assert.equal(s(256), 8);
assert.equal(s(max), 60);

let deckSize = bigInt(62);
let sum = bigInt(0);
let count = 15;

do
{
    let shuffle = s(deckSize);
    if (shuffle === 60)
    {
        sum = sum.add(deckSize);
        console.log(deckSize.toString() + " - " + deckSize.minus(2).divide(2).toString());
        if (count-- === 0)
            break;
    }    
    deckSize = deckSize.add(2);
}
while (deckSize.lesser(max));
