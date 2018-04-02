// Under The Rainbow

// 70 colored balls are placed in an urn, 10 for each of the seven rainbow colors.
// What is the expected number of distinct colors in 20 randomly picked balls?
// Give your answer with nine digits after the decimal point (a.bcdefghij).

let totalBalls = 70;

let chances = [];
let maxColorCount = 0;

function chanceOfExistingColor(colorCount, pickedCount)
{
    let remaining = 10*colorCount - pickedCount; // Total remaining balls 
    let total     = totalBalls - pickedCount;

    if (remaining <= 0)
        return 0;
 
    let chances = remaining / total;

    return chances;
}

function chanceOfNewColor(colorCount, pickedCount)
{
    let remaining = 10*colorCount - pickedCount; // Total remaining balls 
    let total     = totalBalls - pickedCount;

    if (remaining <= 0)
        return 1;
 
    let chances = (total-remaining) / total;    

    return chances;
}

function executeStep(step)
{
    if (step === 1)
    {
        // Initialization
        chances[0] = 0; // 
        chances[1] = 1; // 
        chances[2] = 0; // 
        chances[3] = 0; // 
        chances[4] = 0; // 
        chances[5] = 0; // 
        chances[6] = 0; // 
        chances[7] = 0; // 
        maxColorCount = 1;
        return;
    }

    let maxCount = maxColorCount;

    if (maxCount < 7)
    {
        // We can add more
        chances[maxCount+1] = chances[maxCount] * chanceOfNewColor(maxCount, step-1);
        maxColorCount++;
    }

    for(let color = maxCount; color >= 1; color--)
    {
        chances[color] = (chances[color] * chanceOfExistingColor(color, step-1)) + 
                         (chances[color-1] * chanceOfNewColor(color-1, step-1));
    }
}

for(let step = 1; step <= 20; step++)
    executeStep(step);

let result = 0;

for (let c = 1; c <= 7; c++)
    result += c*chances[c];

result = Math.floor(result*1000000000)/1000000000;
console.log("Answer is " + result);
console.log('Done');
