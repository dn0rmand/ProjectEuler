const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('data/p083_matrix.txt')
});

let matrix  = [];
let minSum  = -1;
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

    if (x === SIZE-1 && y === SIZE-1) // Reached the end
    {
        if (minSum === -1 || sum < minSum)
            minSum = sum;
        return;
    }

    findMinimalSum(x+1, y, sum);       
    findMinimalSum(x, y+1, sum);
    findMinimalSum(x, y-1, sum);
    findMinimalSum(x-1, y, sum);
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
    findMinimalSum(0, 0, 0);
    console.log("Minimal path sum is " + minSum + " (2297)");
    process.exit(0);
});
