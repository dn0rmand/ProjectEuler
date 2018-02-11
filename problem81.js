const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('data/p081_matrix.txt')
});

let matrix = [];
let memoize = [];

function findMinimalSum(x, y)
{
    let k = x + y*100;
    let value = memoize[k];
    if (value !== undefined)
        return value;

    if (x === 79 && y === 79) // Reached the end
    {
        return matrix[y][x];
    }
    else 
    {
        let s1 = -1, s2 = -1;
        if (x < 79)
            s1 = findMinimalSum(x+1, y);
        
        if (y < 79)
            s2 = findMinimalSum(x, y+1);

        let sum;
        if (s1 >= 0 && s2 >= 0)
            sum = (s1 > s2 ? s2 : s1) + matrix[y][x];
        else if (s1 >= 0)
            sum = s1 + matrix[y][x];
        else if (s2 >= 0)
            sum = s2 + matrix[y][x];
        else
            sum = -1; // Dead-End

        memoize[k] = sum;
        return sum;
    }
}

readInput
.on('line', (line) => { 
    let row = line.split(',');
    
    for (let i = 0; i < row.length; i++)
        row[i] = +(row[i]);

    matrix.push(row);
})

.on('close', () => {
    let minSum = findMinimalSum(0, 0);
    console.log("Minimal path sum is " + minSum);
    process.exit(0);
});
