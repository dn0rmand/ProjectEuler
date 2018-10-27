// Nim Square
// ----------
// Problem 310
// -----------
// Alice and Bob play the game Nim Square.
// Nim Square is just like ordinary three-heap normal play Nim, but the players may only remove a square
// number of stones from a heap.
// The number of stones in the three heaps is represented by the ordered triple (a,b,c).
// If 0 ≤ a ≤ b ≤ c ≤ 29 then the number of losing positions for the next player is 1160.

// Find the number of losing positions for the next player if 0 ≤ a ≤ b ≤ c ≤ 100 000.

const assert = require('assert');
const timeLog = require('tools/timeLogger');

const MAX = 100000;

function calculateGrundyNumbers(max)
{
    let memoize = [];

    function calculateGrundy(size)
    {
        if (size < 1)
            return 0;

        let result  = memoize[size];
        if (result !== undefined)
            return result;

        let numbers = new Set();
        let max     = Math.floor(Math.sqrt(size));

        for (let move = 1; move <= max; move++)
        {
            let rest = size - (move*move);
            numbers.add(calculateGrundy(rest));
        }

        result = 0;

        for (let i = 0; i <= size; i++)
        {
            if (! numbers.has(i))
            {
                result = i;
                break;
            }
        }

        memoize[size] = result;
        return result;
    }

    let numbers = [];

    for (let stones = 0; stones <= max; stones++)
    {
        numbers.push(calculateGrundy(stones));
    }

    return numbers;
}

function solve(max, trace)
{
    function findIndex(set, value)
    {
        let count = set.length;
        let min = 0, max = count-1;
        if (set[max] < value)
            return -1;
        if (set[min] >= value)
            return 0;

        let result = set.indexes[value];
        if (result !== undefined)
            return result;
        let current = Math.floor((min+max)/2);
        while (true)
        {
            let v = set[current];

            if (v === value)
            {
                set.indexes[value] = current;
                return current;
            }

            if (v < value)
            {
                min = current;
                current = Math.floor((min+max)/2);
                if (current === min)
                {
                    set.indexes[value] = current+1;
                    return current+1;
                }
            }
            else
            {
                max = current;
                current = Math.floor((min+max)/2);
                if (current === max)
                {
                    set.indexes[value] = current;
                    return current;
                }
            }
        }
    }

    let numbers;

    if (trace === true)
        timeLog("calculating Grundy Numbers", () => {
            numbers = calculateGrundyNumbers(max);
        });
    else
        numbers = calculateGrundyNumbers(max);

    let total   = 0;
    let map     = new Map();

    for (let s = 0; s <= max; s++)
    {
        let n = numbers[s];
        let v = map.get(n);
        if (v === undefined)
        {
            v = [s];
            v.indexes = [];
            v.indexes[s] = 0;
            map.set(n, v);
        }
        else
        {
            v.push(s);
            v.indexes[s] = v.length-1;
        }
    }

    let distinct = [...map.keys()];
    let memoize = {};

    let set1, set2, set3 ;
    for (let a = 0; a < distinct.length; a++, set1=undefined)
    {
        if (trace === true)
            process.stdout.write('\r' + a);

        for (let b = 0; b < distinct.length; b++, set2=undefined)
        for (let c = 0; c < distinct.length; c++)
        {
            let ga = distinct[a];
            let gb = distinct[b];
            let gc = distinct[c];

            if ((ga ^ gb ^ gc) !== 0)
                continue;

            set1 = set1 || map.get(ga);
            set2 = set2 || map.get(gb);
            set3 = map.get(gc);

            let k = gb+"-"+gc+"-";

            for (let s1 of set1)
            {
                let i2 = findIndex(set2, s1);
                if (i2 === -1)
                    continue;

                let kk = k+i2;
                let subTotal = memoize[kk];
                if (subTotal === undefined)
                {
                    subTotal = 0;
                    for (let i = i2; i < set2.length; i++)
                    {
                        let i3 = findIndex(set3, set2[i]);
                        if (i3 === -1)
                            continue;

                        subTotal += set3.length-i3;
                    }
                    memoize[kk] = subTotal;
                }
                total += subTotal;
            }
        }
    }

    if (trace === true)
        process.stdout.write('\n');
    return total;
}

assert.equal(solve(29), 1160);

timeLog(undefined, ()=> {
    let answer = solve(MAX, true);
    console.log('Answer is', answer);
});
