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
        chances[0] = undefined; // 
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

    for(let i = 1; i <= maxColorCount; i++)
    {
        chances[i] *= chanceOfExistingColor(i, step-1);
    }

    if (maxColorCount < 7)
    {
        // We can add more
        chances[maxColorCount+1] = chanceOfNewColor(maxColorCount, step-1);
        maxColorCount++;
    }
}

function calculateChanges(colorCount)
{
    let total = 70;
    let cards = colorCount*10;
    let chances = 1;

    for (let i = 0; i < 20; i++)
    {
        chances *= (cards / total);
        cards--;
        total--;
    }
    return chances;
}

for(let step = 1; step <= 20; step++)
    executeStep(step);

console.log(chances[1]);
console.log(chances[2]);
console.log(chances[3]);
console.log(chances[4]);
console.log(chances[5]);
console.log(chances[6]);
console.log(chances[7]);

let chance =// calculateChanges(1) + 
            //  calculateChanges(2) +
            //  calculateChanges(3) +
            //  calculateChanges(4) +
            //  calculateChanges(5) +
            calculateChanges(6);

chance = 7*(1-chance);
chance = Math.floor(chance*1000000000)/1000000000;
console.log(chance);
//chances[7] = calculateChanges(7);

// let total = 0;
// for (let color = 1; color < 7 ; color++)
//     total += chances[color];

// total += 7*(1+total-chances[7]);

// console.log(total);
// 6.818741802;


// 7*(1-prob) = 6.818741802
// 1-prob = 6.818741802/7
// prob = 1-6.818741802/7
// prob = 0.0258940282857143

console.log('Done');

/*

0
6.827475454045845e-17
1.8399530020822342e-9
0.000005100308006238302
0.0007559163237121202
0.020866401886459163
0.15625

*/