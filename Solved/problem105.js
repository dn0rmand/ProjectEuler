// Special subset sums: testing
// ----------------------------
// Problem 105
// -----------
// Let S(A) represent the sum of elements in set A of size n. We shall call it a special sum set if for any
// two non-empty disjoint subsets, B and C, the following properties are true:

// S(B) ≠ S(C); that is, sums of subsets cannot be equal.
// If B contains more elements than C then S(B) > S(C).
// For example, {81, 88, 75, 42, 87, 84, 86, 65} is not a special sum set because 65 + 87 + 88 = 75 + 81 + 84,
// whereas {157, 150, 164, 119, 79, 159, 161, 139, 158} satisfies both rules for all possible subset pair
// combinations and S(A) = 1286.

// Using sets.txt (right click and "Save Link/Target As..."), a 4K text file with one-hundred sets containing
// seven to twelve elements (the two examples given above are the first two sets in the file), identify all the
// special sum sets, A1, A2, ..., Ak, and find the value of S(A1) + S(A2) + ... + S(Ak).

// NOTE: This problem is related to Problem 103 and Problem 106.

const fs        = require('fs');
const readline  = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p105_sets.txt')
});

let total = 0;

readInput
.on('line', (input) => {
    let set = input.split(',');
    let sum = 0;
    let values = {};

    for (let i = 0; i < set.length; i++)
    {
        let value = +(set[i]);

        if (values[value] !== undefined)
        {
            sum = 0;
            break;
        }

        values[value] = 1;
        set[i] = value;
        sum += value;
    }
    if (isSpecial(set))
        total += sum;
})

.on('close', () => {
    console.log("Answer is", total);
    process.exit(0);
});

function isSpecial(set)
{
    let used = [];

    function *makeSet(value, index)
    {
        if (value.count >= set.length)
            return;

        if (value.count !== 0)
            yield value;

        if (value.count+1 >= set.length)
            return;

        for (let i = index; i < set.length; i++)
        {
            if (used[i] !== 1)
            {
                used[i] = 1;
                value.value += set[i];
                value.count++;
                yield *makeSet(value, i+1);
                value.value -= set[i];
                value.count--;
                used[i] = 0;
            }
        }
    }

    for (let s1 of makeSet({value:0, count:0}, 0))
    {
        for (let s2 of makeSet({value:0, count:0}, 0))
        {
            if (s1.value === s2.value)
                return false;
            if (s1.count < s2.count && s1.value >= s2.value)
                return false;
            if (s1.count > s2.count && s1.value <= s2.value)
                return false;
        }
    }
    return true;
}