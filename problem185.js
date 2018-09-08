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

function $solve(inputs)
{
    inputs.sort((a, b) => a.correct - b.correct);

    let solution = [];
    let count    = inputs[0].values.length;

    for (let i = 0; i < count; i++)
    {
        solution[i] = { notPossible: [], possible: [] };
    }

    for (let input of inputs)
    {
        if (input.correct === 0)
        {
            for (let i = 0; i < count; i++)
            {
                let s = solution[i];
                let d = input.values[i];

                s.notPossible[d] = 1;
            }
        }
        else
        {
            for (let i = 0; i < count; i++)
            {
                let s = solution[i];
                let d = input.values[i];

                if (s.notPossible[d] !== 1)
                {
                    s.possible[d] = 1;
                }
            }
        }
    }

    console.log(solution);
}

function solve(inputs)
{
    let count = inputs[0].values.length;

    for (let input of inputs)
    {
        if (typeof(input.values) === 'string')
        {
            input.values = input.values.split('');
            for (let i = 0; i < count; i++)
                input.values[i] = +(input.values[i]);
        }
    }

    let $isValid = {};

    function isValid(data, final)
    {
        let key;
        if (! final)
        {
            key = data.join(',');
            let result = $isValid[key];
            if (result !== undefined)
                return result;
        }

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
                    correct++;
            }
            if (correct > input.correct)
            {
                $isValid[key] = false;
                return false;
            }

            if (final && correct !== input.correct)
                return false;
        }
        if (! final)
            $isValid[key] = true;
        return true;
    }

    function *innerSolve(start, end)
    {
        let solution = [];
        solution[count-1] = undefined; // Force allocation

        function *inner(index, count)
        {
            if (index >= inputs.length)
            {
                if (count === end-start)
                    yield solution.join('');
                return ;
            }

            let input = inputs[index];

            function *inner2(pos, correct, count)
            {
                if (correct === 0)
                {
                    yield *inner(index+1, count);
                }
                else
                {
                    for (let p = pos; p < end; p++)
                    {
                        let d = input.values[p];

                        if (solution[p] === undefined)
                        {
                            solution[p] = d;

                            if (isValid(solution))
                                yield *inner2(pos+1, correct-1, count+1);

                            solution[p] = undefined;
                        }
                        else if (solution[p] === d)
                        {
                            yield *inner2(pos+1, correct-1, count);
                        }
                    }
                }
            }

            yield *inner2(start, input.correct, count);
        }

        yield *inner(0, 0);
    }

    if (count === 16)
    {
        if (! inner(0, 0, 0, 8))
            return 'No Solutions';
    }
    else
    {
        for (let sol in innerSolve(0, count))
        {
            if (isValid(sol, true))
            {
                return sol;
            }
        }

        return 'No solutions';
    }
}

assert.equal(solve(sampleInput), "39542") ;

let answer = solve(problemInput);
console.log('Answer is', answer);