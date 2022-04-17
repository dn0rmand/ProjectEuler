const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX_ROOM = 30;
const MAX_HAND = 40;

function M(handSize, roomCount)
{
    handSize = BigInt(handSize);

    const trip = handSize-2n;

    let needed = 1n;

    for(let room = roomCount; room > 0; room--)
    {
        let consumed = 0n;

        if (needed >= handSize)
        {
            const offset = needed-handSize;
            const count  = (offset - (offset % trip)) / trip;

            needed   -= count * trip;
            consumed += count * handSize;

            if (needed >= handSize)
                needed += consumed + handSize - trip + 1n
            else
                needed += consumed + 1n;
        }
        else
            needed += consumed +  1n;
    }

    return needed;
}

function solve(maxC, rooms)
{
    let total = 0n;

    for (let c = maxC; c >= 3; c--)
    {
        const value = M(c, rooms);
        total += value;
    }

    return total;
}

assert.equal(M(3, 6), 123);
assert.equal(M(4, 6), 23);

assert.equal(solve(4, 6), 146);
assert.equal(solve(10, 10), 10382);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX_HAND, MAX_ROOM));

console.log(`Answer is ${answer}`);