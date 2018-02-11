const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('data/p083_matrix.txt')
});

let matrix = [];
let memoize = [];
let SIZE;

function findMinimalSum(x, y, visited)
{
    let k = x + y*100;
        
    let value = memoize[k];
    if (value !== undefined)
        return value;
        
    if (x === SIZE-1 && y === SIZE-1) // Reached the end
    {
        return matrix[y][x];
    }
    else if (x >= SIZE || y >= SIZE || x < 0 || y < 0)
        return -1;
    else 
    {
        if (visited[k] === 1)
            return -2;
    
        let sums = [-1, -1, -1, -1];

        visited[k] = 1;

        sums[0] = findMinimalSum(x+1, y, visited);
        sums[1] = findMinimalSum(x, y+1, visited);
        sums[2] = findMinimalSum(x-1, y, visited);        
        sums[3] = findMinimalSum(x, y-1, visited);

        visited[k] = 0;

        let sum = -1;
        let hadVisited = false;
        for (let i = 0; i < sums.length; i++)
        {
            if (sums[i] === -2)
                hadVisited = true;

            if ((sums[i] >= 0 && sums[i] < sum) || sum < 0)
            {
                sum = sums[i];
            }
        }

        if (sum >= 0)
        {
            sum += matrix[y][x];

            if (! hadVisited)
                memoize[k] = sum;

            return sum;
        }        
        else
        {
            if (! hadVisited)
                memoize[k] = -1;

            return -1; // Dead-End
        }
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
    SIZE = matrix.length;
    let minSum = findMinimalSum(0, 0, []);
    console.log("Minimal path sum is " + minSum + " (2297)");
    process.exit(0);
});
