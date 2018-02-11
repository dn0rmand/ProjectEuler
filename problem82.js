const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('data/p082_matrix.txt')
});

let matrix  = [];
let memoize = [];
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

function findMinimalSum(x, y, visited)
{
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE)
    {
        return -1;
    }    

    if (x === SIZE-1) // Reached the end
    {
        return matrix[y][x];
    }

    let k = x + y*100;
    let value = memoize[k];
    if (value !== undefined)
        return value;

    if (visited[k] === 1)
        return -1;
    
    visited[k] = 1;

    let sums = [
        findMinimalSum(x+1, y, visited),       
        findMinimalSum(x, y+1, visited),
        findMinimalSum(x, y-1, visited)
    ];

    visited[k] = 0;

    let sum = getMinSum(sums);

    if (sum !== -1)
    {
        sum += matrix[y][x];
        memoize[k] = sum;
    }
    else
        memoize[k] = -1;

    return sum;
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

    let sums = [];

    for(let y = 0; y < SIZE; y++)
    {
        memoize = [];
        sums.push(findMinimalSum(0, y, []));
    }
    let minSum = getMinSum(sums);
    console.log("Minimal path sum is " + minSum);
    process.exit(0);
});
