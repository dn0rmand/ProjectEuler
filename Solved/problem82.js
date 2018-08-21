const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p082_matrix.txt')
});

let matrix  = [];
let SIZE    = -1;

function getMinSum(sums)
{
    let sum = -1;
    for (let i = 0; i < sums.length; i++)
    {
        if (sums[i] === -1) continue;
        if (sum === -1 || sums[i] < sum)
            sum = sums[i];
    }
    return sum;
}

let minSum = -1;
let memoize = [];

function findMinimalSum(x, y, sum)
{
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE)
        return;

    sum += matrix[y][x];

    if (minSum !== -1 && sum > minSum)
        return;

    let k = x + 100*y;
    let min = memoize[k];
    if (min !== undefined)
    {
        if (min < sum)
            return; // Already got to this with a lower sum
    }
    memoize[k] = sum;

    if (x === SIZE-1) // Reached the end
    {
        if (minSum === -1 || sum < minSum)
            minSum = sum;
        return;
    }

    findMinimalSum(x+1, y, sum);       
    findMinimalSum(x, y+1, sum);
    findMinimalSum(x, y-1, sum);
}

readInput
.on('line', (line) => { 
    let row = line.split(',');
    
    for (let i = 0; i < row.length; i++)
        row[i] = +(row[i]);

    matrix.push(row);
})

.on('close', () => {
    SIZE = matrix.length;

    for(let y = 0; y < SIZE; y++)
    {
        findMinimalSum(0, y, 0);
    }
    console.log("Minimal path sum is " + minSum);
    process.exit(0);
});
