const assert     = require('assert');
const Tracer     = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const BigMap     = require('@dn0rmand/project-euler-tools/src/BigMap');

const MAX_W = 40;
const MAX_B = 60;
const BITS  = 6;
const MASK  = (2 << (BITS-1)) - 1;

function solve(B, W)
{
    const makeGroup = (b, w) => (b << BITS) | w;

    function generateGroups()
    {
        const groups = new Set();
    
        for(let b = B; b >= 0; b--)
        for(let w = W; w >= 0; w--)
        {
            if (b+w === 0)
                continue;

            groups.add(makeGroup(b, w));
        }

        return [...groups.keys()];
    }

    const groupKeys = generateGroups();
    const memoize   = [];

    function getMemoize(B, W, index)
    {
        if (! memoize[B])
            return;
        if (! memoize[B][W])
            return;

        return memoize[B][W][index];
    }

    function setMemoize(B, W, index, value)
    {
        if (! memoize[B])
            memoize[B] = [];
        if (! memoize[B][W])
            memoize[B][W] = [];

        memoize[B][W][index] = value;
    }

    function inner(B, W, index)
    {
        if (B === 0 && W === 0)
            return 1n;

        if (index >= groupKeys.length)
            return 0n;
        if (B < 0 || W < 0)
            return 0n;

        let total = getMemoize(B, W, index);
        if (total !== undefined)
            return total;

        total = 0n;
        for(let g = index ; g < groupKeys.length; g++)
        {
            let k      = groupKeys[g];
            let w      = k & MASK;
            let b      = (k-w) >>> BITS;

            if (b > B || w > W)
                continue;

            let bb = b;
            let ww = w;
            while (b <= B && w <= W)
            {
                total += inner(B-b, W-w, g+1);

                b += bb;
                w += ww;
            }
        }

        setMemoize(B, W, index, total);
        return total;
    }

    const total = inner(B, W, 0);
    return total;
}

assert.equal(solve(3, 1), 7);
assert.equal(solve(10, 5), 3804);
assert.equal(solve(30, 5), 1961432);
assert.equal(solve(30,20), 9857579142);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => solve(MAX_B, MAX_W));
console.log(`Answer is ${answer}`);
