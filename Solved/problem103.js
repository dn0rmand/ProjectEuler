// Special subset sums: optimum
// ----------------------------
// Problem 103
// -----------
// Let S(A) represent the sum of elements in set A of size n. We shall call it a special sum set if
// for any two non-empty disjoint subsets, B and C, the following properties are true:

// S(B) ≠ S(C); that is, sums of subsets cannot be equal.
// If B contains more elements than C then S(B) > S(C).
// If S(A) is minimised for a given n, we shall call it an optimum special sum set. The first five optimum
// special sum sets are given below.

// n = 1: {1}
// n = 2: {1, 2}
// n = 3: {2, 3, 4}
// n = 4: {3, 5, 6, 7}
// n = 5: {6, 9, 11, 12, 13}

// It seems that for a given optimum set, A = {a1, a2, ... , an}, the next optimum set is of the form
// B = {b, a1+b, a2+b, ... ,an+b}, where b is the "middle" element on the previous row.

// By applying this "rule" we would expect the optimum set for n = 6 to be A = {11, 17, 20, 22, 23, 24},
// with S(A) = 117. However, this is not the optimum set, as we have merely applied an algorithm to provide
// a near optimum set. The optimum set for n = 6 is A = {11, 18, 19, 20, 22, 25}, with S(A) = 115
// and corresponding set string: 111819202225.

// Given that A is an optimum special sum set for n = 7, find its set string.

// NOTE: This problem is related to Problem 105 and Problem 106.

// A = {11, 18, 19, 20, 22, 25}

function nearOptimum(set6)
{
    let set7 = [];

    let middle = Math.ceil(set6.length / 2);
    let b = set6[middle];
    set7.push(b);
    for(let v of set6)
        set7.push(b+v);

    if (! isSpecial(set7))
        throw "ERROR";

    return set7;
}

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

function optimize(set, DELTA)
{
    let minSum = set.reduce((a, v) => { return a+v; }, 0);
    let minKey = set.join('');

    function inner(index, previous, sum)
    {
        if (index >= set.length)
        {
            if (sum < minSum && isSpecial(set))
            {
                minSum = sum;
                minKey = set.join('');
                console.log(minSum, '->', minKey);
            }
            return;
        }

        for (let s2 = previous+1; ; s2++)
        {
            let newSum = sum + s2;
            if (newSum >= minSum)
                break;

            set[index] = s2;
            inner(index+1, s2, newSum);
        }
    }

    let min = set[0]-DELTA;
    let max = set[0]+DELTA;

    for (let i = 0; i < set.length; i++)
        set[i] = 0;

    for (let sum = min; sum <= max; sum++)
    {
        set[0] = sum;
        inner(1, sum, sum);
    }

    return minKey;
}

let check = optimize([11, 17, 20, 22, 23, 24], 0);
console.assert(check === "111819202225", "Optimization failed");

let set    = nearOptimum([11, 18, 19, 20, 22, 25]);
                      // [20, 31, 38, 39, 40, 42, 45]
let answer = optimize(set, 0);
console.log('Answer is', answer);

