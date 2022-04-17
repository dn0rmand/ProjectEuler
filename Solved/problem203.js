const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const assert = require('assert');

function nextRow(previousRow)
{
    let currentRow = [];
    let length = previousRow.length+1;

    currentRow[0] = 1;
    currentRow[length-1] = 1;
    for (let i = 1; i < length/2; i++)
    {
        let value = previousRow[i-1] + previousRow[i];
        currentRow[i] = currentRow[length-(i+1)] = value;
    }
    return currentRow;
}

function solve(maxRow)
{
    let previous = [];
    let distinctValues = new Set();

    for(let i = 1; i <= maxRow; i++)
    {
        let r = nextRow(previous);
        r.forEach((v) => {
            distinctValues.add(v);
        });
        previous = r;
    }

    let total = 0;
    for (let v of distinctValues)
    {
        let squareFree = true;
        primeHelper.factorize(v, (p, c) => {
            if (c > 1)
            {
                squareFree = false;
                return false;
            }
        });
        if (squareFree)
            total += v;
    }

    return total;
}

console.time(203);

primeHelper.initialize(2E7);
assert.equal(solve(8), 105);

let answer = solve(51);

console.timeEnd(203);
console.log("Answer is", answer);
