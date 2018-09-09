// Number Mind
// -----------
// Problem 185
// -----------

// The game Number Mind is a variant of the well known game Master Mind.

// Instead of coloured pegs, you have to guess a secret sequence of digits.
// After each guess you're only told in how many places you've guessed the correct digit.
// So, if the sequence was 1234 and you guessed 2036, you'd be told that you have one correct digit;
// however, you would NOT be told that you also have another digit in the wrong place.

// For instance, given the following guesses for a 5-digit secret sequence,

// 90342 ;2 correct
// 70794 ;0 correct
// 39458 ;2 correct
// 34109 ;1 correct
// 51545 ;2 correct
// 12531 ;1 correct

// The correct sequence 39542 is unique.

// Based on the following guesses,

// 5616185650518293 ;2 correct
// 3847439647293047 ;1 correct
// 5855462940810587 ;3 correct
// 9742855507068353 ;3 correct
// 4296849643607543 ;3 correct
// 3174248439465858 ;1 correct
// 4513559094146117 ;2 correct
// 7890971548908067 ;3 correct
// 8157356344118483 ;1 correct
// 2615250744386899 ;2 correct
// 8690095851526254 ;3 correct
// 6375711915077050 ;1 correct
// 6913859173121360 ;1 correct
// 6442889055042768 ;2 correct
// 2321386104303845 ;0 correct
// 2326509471271448 ;2 correct
// 5251583379644322 ;2 correct
// 1748270476758276 ;3 correct
// 4895722652190306 ;1 correct
// 3041631117224635 ;3 correct
// 1841236454324589 ;3 correct
// 2659862637316867 ;2 correct

// Find the unique 16-digit secret sequence.

const assert = require('assert');

const sampleInput = [
    { correct: 2, values: "90342" },
    { correct: 0, values: "70794" },
    { correct: 2, values: "39458" },
    { correct: 1, values: "34109" },
    { correct: 2, values: "51545" },
    { correct: 1, values: "12531" },
];

const problemInput = [
    { values: "5616185650518293", correct: 2 },
    { values: "3847439647293047", correct: 1 },
    { values: "5855462940810587", correct: 3 },
    { values: "9742855507068353", correct: 3 },
    { values: "4296849643607543", correct: 3 },
    { values: "3174248439465858", correct: 1 },
    { values: "4513559094146117", correct: 2 },
    { values: "7890971548908067", correct: 3 },
    { values: "8157356344118483", correct: 1 },
    { values: "2615250744386899", correct: 2 },
    { values: "8690095851526254", correct: 3 },
    { values: "6375711915077050", correct: 1 },
    { values: "6913859173121360", correct: 1 },
    { values: "6442889055042768", correct: 2 },
    { values: "2321386104303845", correct: 0 },
    { values: "2326509471271448", correct: 2 },
    { values: "5251583379644322", correct: 2 },
    { values: "1748270476758276", correct: 3 },
    { values: "4895722652190306", correct: 1 },
    { values: "3041631117224635", correct: 3 },
    { values: "1841236454324589", correct: 3 },
    { values: "2659862637316867", correct: 2 }
];

function convertNumber(number)
{
    if (typeof(number) === 'string')
    {
        let values = number.split('');
        for (let i = 0; i < values.length; i++)
            values[i] = +(values[i]);

        return values;
    }
    else
        return number;
}

function convertInputs(inputs)
{
    let count = inputs[0].values.length;

    for (let input of inputs)
    {
        input.values = convertNumber(input.values);
    }

    inputs.sort((a, b) => a.correct-b.correct);

    return count;
}

function solve(inputs)
{
    let count = convertInputs(inputs);

    let $isValid = {};

    function isValid(data, final)
    {
        // if (! final)
        //     return true;

        data = convertNumber(data);

        let key = (final ? "1:" : "0:") + data.join(',');
        let result = $isValid[key];
        if (result !== undefined)
            return result;

        for (let input of inputs)
        {
            let correct = 0;
            for (let i = 0; i < count; i++)
            {
                let d = data[i];
                if (d === undefined)
                {
                    if (final)
                        return false;
                    continue;
                }
                let d2 = input.values[i];
                if (d === d2)
                {
                    correct++;
                    if (correct > input.correct)
                    {
                        $isValid[key] = false;
                        return false;
                    }
                }
            }
            if (correct > input.correct)
            {
                $isValid[key] = false;
                return false;
            }

            if (final && correct !== input.correct)
            {
                $isValid[key] = false;
                return false;
            }
        }
        $isValid[key] = true;
        return true;
    }

    let solution  = [];
    let exclusions = [];

    function getExclusion(pos, digit)
    {
        let ex = exclusions[pos];
        if (ex === undefined)
            return 0;

        return ex[digit] || 0;
    }

    function unExclude(pos, digit)
    {
        let ex = exclusions[pos];
        if (ex === undefined)
            throw "Error";

        let c = ex[digit] || 0;
        if (c <= 0)
            throw "Error";
        ex[digit] = c-1;
    }

    function reExclude(pos, digit)
    {
        let ex = exclusions[pos];
        if (ex === undefined)
            throw "Error";

        ex[digit] = (ex[digit] || 0)+1;
    }

    function addExclusions(input)
    {
        for (let i = 0; i < count; i++)
        {
            let ex = exclusions[i];
            if (ex === undefined)
                ex = exclusions[i] = [];

            let d = input.values[i];
            ex[d] = (ex[d] || 0) + 1;
        }
    }

    function removeExclusions(input)
    {
        for (let i = 0; i < count; i++)
        {
            let ex = exclusions[i];
            if (ex === undefined)
                throw "Wasn't added";

            let d = input.values[i];
            let c = (ex[d] || 0) - 1;
            if (c < 0)
                throw "Wasn't added";
            ex[d] = c;
        }
    }

    function check()
    {
        for (let p = 0; p < count; p++)
        {
            let d = solution[p];
            let e = getExclusion(p, d);
            if (e !== 0)
                throw "ERROR";
        }
    }

    function solve(index, length, pos, correct)
    {
        if (length === count)
            return isValid(solution, true);

        if (index < 0)
            return false;

        let input;
        do
        {
            if (correct === 0)
            {
                index--;
                if (index < 0)
                {
                    if (length === count)
                        return isValid(solution, true);
                    else
                        return false;
                }
                pos = undefined;
                correct = undefined;
            }

            input = inputs[index];

            if (pos === undefined)
                pos = 0;
            if (correct === undefined)
                correct = input.correct;
        }
        while (correct === 0);

        let previous = undefined;

        if (pos === 0 && index < inputs.length-1)
        {
            previous = inputs[index+1];
            addExclusions(previous);
        }

        for (let p = pos; p < count-correct+1; p++)
        {
            let d = input.values[p];

            if (solution[p] === undefined)
            {
                let ex = getExclusion(p, d);
                if (ex > 0)
                    continue;

                solution[p] = d;

                if (length+1 === count) // full!
                {
                    if (isValid(solution, true))
                        return true;
                }
                else if (isValid(solution))
                {
                    if (solve(index, length+1, p+1, correct-1))
                        return true;
                }

                solution[p] = undefined;
            }
            else if (solution[p] === d)
            {
                if (solve(index, length, p+1, correct-1))
                {
                    return true;
                }
            }
        }

        if (previous !== undefined)
            removeExclusions(previous);

        return false;
    }

    // add well know exclusion
    for (let input of inputs)
    {
        if (input.correct === 0)
            addExclusions(input);
    }

    for (let input of inputs)
    {
        input.excluded = 0;
        input.other    = Array.from(input.values);
        for (let pos = 0; pos < count; pos++)
        {
            let d = input.values[pos];
            if (getExclusion(pos, d) > 0)
            {
                input.other[pos] = '*';
                input.excluded++;
            }
        }
    }

    inputs.sort((a, b) => a.excluded-b.excluded);

    // solve
    let l = inputs.length-1;
    while (l > 0 && inputs[l].correct === 0)
        l--;

    if (solve(l, 0))
        return solution.join('');

    return 'No Solutions';
}

assert.equal(solve(sampleInput), "39542") ;

let answer = solve(problemInput);
console.log('Answer is', answer);
