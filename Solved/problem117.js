// Red, green, and blue tiles
// --------------------------
// Problem 117 
// -----------
// Using a combination of black square tiles and oblong tiles chosen from: red tiles measuring two units, 
// green tiles measuring three units, and blue tiles measuring four units, it is possible to tile a row measuring 
// five units in length in exactly fifteen different ways.
 
// How many ways can a row measuring fifty units in length be tiled?

var memoize = [];

function solve(spaces)
{
    if (spaces < 0)
        return 0;
    else if (spaces === 0)
        return 1;
        
    let total = memoize[spaces];

    if (total !== undefined)
        return total;

    total = 0;
    for (let i = 1; i <= 4; i++)
    {
        if (i > spaces)
            break;
        total += solve(spaces-i);
    }

    memoize[spaces] = total;
    return total;    
}

let result = solve(50);
if (result > Number.MAX_SAFE_INTEGER)
    throw "ERROR";
console.log("Answer is", result);