// Special subset sums: meta-testing
// ---------------------------------
// Problem 103
// -----------
// Let S(A) represent the sum of elements in set A of size n. We shall call it a special sum set if
// for any two non-empty disjoint subsets, B and C, the following properties are true:

// S(B) ≠ S(C); that is, sums of subsets cannot be equal.
// If B contains more elements than C then S(B) > S(C).

// For this problem we shall assume that a given set contains n strictly increasing elements and it already
// satisfies the second rule.

// Surprisingly, out of the 25 possible subset pairs that can be obtained from a set for which n = 4,
// only 1 of these pairs need to be tested for equality (first rule). Similarly, when n = 7,
// only 70 out of the 966 subset pairs need to be tested.

// For n = 12, how many of the 261625 subset pairs that can be obtained need to be tested for equality?

// NOTE: This problem is related to Problem 103 and Problem 105.

const assert = require('assert');

function nearOptimum(input)
{
    let output = [];

    let middle = Math.ceil(input.length / 2);
    let b = input[middle];
    output.push(b);
    for(let v of input)
        output.push(b+v);

    return output;
}

function solve(set)
{
    let used = [];

    function *makeSet(values, index)
    {
        if (values.length >= set.length)
            return;

        if (values.length !== 0)
            yield values;

        if (values.length+1 >= set.length)
            return;

        for (let i = index; i < set.length; i++)
        {
            if (! used[i])
            {
                used[i] = 1;
                values.push(set[i]);
                yield *makeSet(values, i+1);
                values.pop();
                used[i] = 0;
            }
        }
    }

    let total = 0;
    let cases = 0;

    for (let s1 of makeSet([], 0))
    {
        let k1 = s1.join('');

        for (let s2 of makeSet([], 0))
        {
            let k2 = s2.join('');
            if (k2 <= k1)
                continue;

            cases++;

            if (s1.length != s2.length)
                continue;
            if (s1.length === 1)
                continue;

            let up = 0;
            let down = 0;

            for (let i = 0; i < s1.length; i++)
            {
                if (s1[i] <= s2[i])
                    up++;
                if (s1[i] >= s2[i])
                    down++;
            }
            if (down != s1.length && up != s1.length)
            {
                total++;
            }
        }
    }

    console.log(set.length, ' -> ', total, 'of', cases);

    return total;
}

let s4 = [3, 5, 6, 7];
assert.equal(solve(s4), 1);

let s7 = nearOptimum([11, 17, 20, 22, 23, 24]);
assert.equal(solve(s7), 70);

let s8  = nearOptimum(s7);
let s9  = nearOptimum(s8);
let s10 = nearOptimum(s9);
let s11 = nearOptimum(s10);
let s12 = nearOptimum(s11);

let answer = solve(s12);

console.log('Answer is', answer);
