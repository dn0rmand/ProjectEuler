const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const { rank, unrank } = require('@dn0rmand/project-euler-tools/src/permutationRanking');

// require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);
const MAX_POWER = 25
const MAX = 2**MAX_POWER;
    
const getIndex = (values, trace) => rank(values, trace ? MODULO_N : undefined, trace) + 1n;

function solve(size, trace)
{
    assert.equal(size & 1, 0);

    function buildPermutation(size)
    {
        const middle = size / 2;
        const used   = [];
        const values = [];

        function isGood()
        {
            for(let i = 0; i < size; i++)
            for(let j = i+1; j < size; j++)
            {
                let a = values[i];
                let b = values[j];
                let c = b + (b-a);
                if (used[c] > j)
                    return false;
            }
            return true;
        }

        function canUse(digit, pos1, pos2)
        {
            let tooBig = true;

            const isBad = (a, b, c) => {
                if (c > size || c < 1)
                    return false;
                if (a > size || a < 1)
                    return false;
                if ((a > b && b < c) ||  (a < b && b > c))
                    return false;

                tooBig = false;
                if (used[a] && used[b] && used[c])
                {
                    if (used[a] < used[b] && used[b] < used[c])
                        return true;
                    if (used[c] > used[b] && used[b] > used[a])
                        return true;
                }
                if (used[a] && used[b] && !used[c] && used[a] < used[b])
                    return used[b] < pos2;
                if (used[c] && used[b] && !used[a] && used[c] < used[b])
                    return used[b] < pos2;
                return false;
            } 

            for(let i = 1; i <= size; i++)
            {
                tooBig = true;

                if (isBad(digit, digit+i, digit+i+i))
                    return false;
                if (isBad(digit, digit-i, digit-i-i))
                    return false;
                if (isBad(digit-i, digit, digit+i))
                    return false;

                if (tooBig)
                    break;
            }

            return true;
        }

        function inner(length)
        {
            if (length === middle)
            {
                if (isGood())
                {
                    return values.slice();
                }
                return;
            }

            for(let i = 1; i <= size; i++)
            {
                if (used[i])
                    continue;

                const i2 = size+1-i;

                if (used[i2])
                    continue;

                used[i2] = size-length;
                used[i] = length+1;

                if (length < 1 || canUse(i, length+1, size-length))
                {
                    values[length] = i;
                    values[size-1-length] = i2;
                    const permutation = inner(length+1);
                    if (permutation)
                        return permutation;
                }
                
                used[i] = 0;
                used[i2] = 0;
            }
        }

        let permutation = inner(0);
        if (! permutation)
            throw "No unpredictable permutation";
        return permutation;
    }

    function generatePermutation(size)
    {
        if (size < 4)
            throw "Error";

        if (size === 4)
            return buildPermutation(size);

        let right = generatePermutation(size / 2);
        let left  = [];
        for(let i = 0; i < right.length; i++)
        {
            right[i] *= 2;
            left[i]   = right[i]-1;
        }
        const x = right[0];
        right[0] = left[left.length-1];
        left[left.length-1] = x;

        return left.concat(right);
    }

    let permutation = generatePermutation(size);
    let index       = getIndex(permutation, trace);

    if (! trace)
    {
        let perm = unrank(index-1n, size);
        for(let i = 0; i < size; i++)
            assert.equal(perm[i], permutation[i]);
    }

    return Number(index % MODULO_N);
}

assert.equal(solve(4), 3);
assert.equal(solve(8), 2295);
assert.equal(solve(16), 750326372);
assert.equal(solve(32), 641839205);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
