// Dice Game
// Problem 205 
// Peter has 9 four-sided (pyramidal) dice, each with faces numbered 1, 2, 3, 4.
// Colin has 6 six-sided (cubic) dice, each with faces numbered 1, 2, 3, 4, 5, 6.

// Peter and Colin roll their dice and compare totals: the highest total wins. 
// The result is a draw if the totals are equal.

// What is the probability that Pyramidal Pete beats Cubic Colin? Give your answer rounded to seven 
// decimal places in the form 0.abcdefg

function rolls(dices, max)
{
    let scores = [];

    let maximum = max * dices;

    // after first roll
    for(let i = 0; i <= maximum; i++) 
        scores[i] = 0;

    // initialize with Dice 1
    for (let i = 1; i <= max; i++)
        scores[i] = 1/max;

    // Other dices
    for (let roll = 2; roll <= dices; roll++)
    {
        minScore = roll;
        maxScore = roll * max;

        for (let score = maxScore; score >= minScore; score--)
        {
            let chances = 0;

            for(let i = 1; i <= max; i++)
            {
                if (score >= i)
                    chances += scores[score-i] * 1/max;
            }

            scores[score] = chances;
        }

        for (let score = minScore-1; score > 0; score--)
            scores[score] = 0;
    }

    let total = 0 ;
    for (let i = 0; i < scores.length; i++)
        total += scores[i];

    return scores;
}

let peterScores = rolls(9, 4);
let colinScores = rolls(6, 6);

let wins = [];
let total = 0;
for (let i = 9; i <= 36; i++) // 9 is the minimum peter can do
{
    // probability of colin doing less than i
    let w = 0;
    for (let j = 6; j < i; j++) // 6 is the minimum colin can do
    {
        w += colinScores[j];
    }
    wins[i] = w * peterScores[i];
    total += wins[i];
}

total *= 10000000;
total = Math.round(total);
total /= 10000000;

console.log(total);
