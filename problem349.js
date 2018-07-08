// Langton's ant
// -------------
// Problem 349 
// -----------
// An ant moves on a regular grid of squares that are coloured either black or white.
// The ant is always oriented in one of the cardinal directions (left, right, up or down) and moves from square to 
// adjacent square according to the following rules:
// - if it is on a black square, it flips the color of the square to white, rotates 90 degrees counterclockwise and 
// moves forward one square.
// - if it is on a white square, it flips the color of the square to black, rotates 90 degrees clockwise and moves 
// forward one square.

// Starting with a grid that is entirely white, how many squares are black after 10^18 moves of the ant?

const bigInt = require('big-integer');
const square = new Map();

const ant = {
    direction:'U',
    x:0,
    y:0
};

let blackCount = 0;

function isBlack(x, y)
{
    let a = square.get(x);
    if (a === undefined)
    {
        a = new Map();
        square.set(x, a);
    }
    let v = a.get(y);
    if (v === undefined)
    {
        a.set(y, 0)
        return false;
    }
    return (v === 1);
}

function setColor(x, y, black)
{
    let a = square.get(x);
    if (black === true)
    {
        a.set(y, 1);
        blackCount++;
    }
    else
    {
        blackCount--;
        a.set(y, 0);
    }
}

// For dumping the "image"

let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;

function dump(print)
{    
    minX = Math.min(ant.x, minX);
    minY = Math.min(ant.y, minY);
    maxX = Math.max(ant.x, maxX);
    maxY = Math.max(ant.y, maxY);

    if (print === true)
    {
        console.log(minX,',',minY,' - ', maxX,',',maxY);

        for (let y = minY; y <= maxY; y++)
        {
            let row = '';
            for (let x = minX; x <= maxX; x++)
            {
                if (isBlack(x, y))
                    row += '*';
                else
                    row += ' ';
            }
            console.log(row);
        }
    }
}

function move()
{
    if (isBlack(ant.x, ant.y))
    {
        setColor(ant.x, ant.y, false);
        switch (ant.direction)
        {
            case "U":
                ant.direction = "L";
                ant.x -= 1;
                break
            case "D":
                ant.direction = "R";
                ant.x += 1;
                break
            case "L":
                ant.direction = "D";
                ant.y += 1;
                break;
            case "R":
                ant.direction = "U";
                ant.y -= 1;
                break;
        }
    }
    else
    {
        setColor(ant.x, ant.y, true);
        switch (ant.direction)
        {
            case "U":
                ant.direction = "R";
                ant.x += 1;
                break
            case "D":
                ant.direction = "L";
                ant.x -= 1;
                break
            case "L":
                ant.direction = "U";
                ant.y -= 1;
                break;
            case "R":
                ant.direction = "D";
                ant.y += 1;
                break;
        }
    }

    dump();
}

function solve()
{
    const LOOP_SIZE = 104;

    let moves;

    // Simulate until the ant is stuck in a loop

    for (moves = 0; moves < 11000+64; moves++) // add 64 to have a remainder that's a multiple of LOOP_SIZE
        move();

    dump();

    // Calculate the amount of black added for each loop ( We know the loop size is 104 thanks Wikipedia)

    let v1 = blackCount;

    for (let i = 0; i < LOOP_SIZE; i++)
    {
        move();
        moves++;
    }

    let delta = blackCount - v1;

    // Now multiply with the remaining moves / LOOP_SIZE

    let remaining = bigInt(10).pow(18).minus(moves); // remaining moves
    let blacks = bigInt(remaining).divide(LOOP_SIZE).times(delta).plus(blackCount);

    // That's it!
    return blacks.toString();
}

let answer = solve();

console.log(answer, "squares are black after 10^18 moves.");