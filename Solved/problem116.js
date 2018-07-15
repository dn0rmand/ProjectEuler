// Red, green or blue tiles
// ------------------------
// Problem 116 
// -----------
// A row of five black square tiles is to have a number of its tiles replaced with coloured oblong tiles chosen 
// from red (length two), green (length three), or blue (length four).

// Assuming that colours cannot be mixed there are 7 + 3 + 2 = 12 ways of replacing the black tiles in a row 
// measuring five units in length.

// How many different ways can the black tiles in a row measuring fifty units in length be replaced if colours 
// cannot be mixed and at least one coloured tile must be used?

function solve(spaces, color)
{
    let colors = [1, color];
    let memoize = [];

    function inner(spaces)
    {
        if (spaces < 0)
            return 0;
        else if (spaces < color)
            return 1;
            
        let total = memoize[spaces];

        if (total !== undefined)
            return total;

        total = 0;

        for (let c of colors)
        {
            total += inner(spaces - c);
        }

        memoize[spaces] = total;
        return total;    
    }

    return inner(spaces)-1;
}

function SolveProblem(size)
{
    let t1 = solve(size, 2);
    let t2 = solve(size, 3);
    let t3 = solve(size, 4);

    return t1+t2+t3;
}

// console.log(SolveProblem(5));

let result = SolveProblem(50);
if (result > Number.MAX_SAFE_INTEGER)
    throw "ERROR";
console.log("Answer is", result);