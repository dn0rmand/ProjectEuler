// Perfect Square Collection
// -------------------------
// Problem 142
//
// Find the smallest x + y + z with integers x > y > z > 0 such that x + y, x − y, x + z, x − z, y + z, y − z
// are all perfect squares.

const assert = require('assert');
const prettyTime = require('pretty-hrtime');

const MAX_SQUARE = 1E10;

const squares = new Set();
const allSquares = [];

function loadSquares()
{
    for (let i = 1; ; i++)
    {
        let s = i*i;
        if (s > MAX_SQUARE)
            break;

        squares.add(s);
        allSquares.push(s);
    }
}

function isSquare(value)
{
    if (squares.has(value))
        return true;

    return false;
}

function solve()
{
    let answer = Number.MAX_SAFE_INTEGER;

    for (let s1 = 0; s1 < allSquares.length; s1++)
    {
        let square1 = allSquares[s1];

        for (let z = 1; z < square1; z++)
        {
            let y = square1-z;
            if (y <= z)
                break;
            if (! isSquare(y-z))
                continue;

            for (let s2 = allSquares.length-1; s2 > s1; s2--)
            {
                let square2 = allSquares[s2];
                let x = square2-y;

                if (x <= y)
                    break;
                if (isSquare(x-y) && isSquare(x+z) && isSquare(x-z))
                {
                    let a = x+y+z;
                    if (a < answer)
                        answer = a;
                }
            }
        }
    }

    if (answer === Number.MAX_SAFE_INTEGER)
        throw "No Answer";
    return answer;
}

loadSquares();

let timer = process.hrtime();
let answer = solve();
timer = process.hrtime(timer);
console.log(`Answer is ${ answer } calculated in ${ prettyTime(timer, {verbose:true}) }`);
