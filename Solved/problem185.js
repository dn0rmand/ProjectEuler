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

if (global.gc === undefined)
    global.gc = () => {};

const assert = require('assert');
const DIGITS = "4602157893"; // "0123456789"; // 4640261571849533

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

function randomDigit(antiSolution, position)
{
    let forbidden = {};

    for (let input of antiSolution)
    {
        let c = input.values[position];
        forbidden[c] = 1;
    }
    while (true)
    {
        let v = Math.floor(Math.random() * 97) % 10;
        v = v.toString();
        if (forbidden[v] !== 1)
            return v;
    }
}

function getDistance(inputs, solution)
{
    let distance = 0;

    for (let input of inputs)
    {
        let matches = 0;
        for (let pos = 0; pos < solution.length; pos++)
            if (input.values[pos] === solution[pos])
                matches++;
        let error = Math.abs(matches - input.correct);

        distance += error;
    }

    return distance;
}

function solve(inputs)
{
    let solution    = [];
    let antiSolution= [];
    let count       = inputs[0].values.length;

    for (let input of inputs)
    {
        if (input.correct === 0)
            antiSolution.push(input);
    }

    for (let pos = 0; pos < count; pos++)
    {
        let c = randomDigit(antiSolution, pos);
        solution.push(c);
    }

    let distance = getDistance(inputs, solution);
    let counter  = 0;

    const MAX_COUNTER = 10;

    while (distance > 0)
    {
        counter++;

        let bestPos = undefined;
        let bestDistance = undefined;
        let bestChar = undefined;

        for (let pos = 0; pos < count; pos++)
        {
            let old = solution[pos];
            let c = old;

            while (c === old)
                c = randomDigit(antiSolution, pos);

            solution[pos] = c;
            let newDistance = getDistance(inputs, solution);
            if (newDistance === 0)
            {
                distance = 0;
                counter  = 0;
                break; // Done
            }

            if (newDistance >= distance)
            {
                if (counter >= MAX_COUNTER)
                {
                    if (bestDistance === undefined || newDistance < bestDistance)
                    {
                        bestDistance = newDistance;
                        bestPos      = pos;
                        bestChar     = c;
                    }
                }
                solution[pos] = old;
            }
            else
            {
                counter  = 0; // reset counter
                distance = newDistance;
            }
        }
        if (distance !== 0 && bestDistance !== undefined)
        {
            distance = bestDistance;
            solution[bestPos] = bestChar;
            counter  = 0;
        }
        if (counter === 0)
            process.stdout.write('\r' + solution.join('') + ' : ' + distance + ' ');
    }
    console.log('');
    return solution.join('');
}

assert.equal(solve(sampleInput), "39542") ;

console.time(185);
let answer = solve(problemInput);
console.timeEnd(185);
console.log('Answer is', answer);
