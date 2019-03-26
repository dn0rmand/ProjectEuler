const assert = require('assert');
const prettyTime= require("pretty-hrtime");

const MAX = 10000;
const MODULO = 1000000007;

function loadFibonacci(W, H)
{
    const max = Math.floor((W*H)*(1.5));
    const values = [1, 2];

    let previous = 2;
    let current  = 3;
    while (current < max)
    {
        values.push(current); // Store the square to not have to use sqrt
        let next = previous+current;
        previous = current;
        current  = next;
    }

    return values;
}

function createMap(W, H)
{
    const map = []
    const size = Math.max(W, H);

    for (let x = 0; x <= size; x++)
    {
        map.push(new Uint32Array(size+1));
    }

    map[W][H] = 1;
    return map;
}

function loadMoves(W, H)
{
    const fibs  = loadFibonacci(W, H);
    const moves = []

    for (let x = 0; x <= W; x++)
    {
        for (let y = 0; y <= H; y++)
        {
            let distance = Math.sqrt((x*x) + (y*y));
            if (distance != Math.floor(distance))
                continue;
            if (distance === 0)
                continue;

            if (fibs.includes(distance))
            {
                moves.push({x:x, y:y});
            }
        }
    }
    return moves;
}

function F(W, H, trace)
{
    const moves = loadMoves(W, H);
    const map   = createMap(W, H);

    function processPoint(w, h)
    {
        if (w === 0 && h === 0)
            return;

        const value = map[w][h];

        // if (value === 0)
        //     return;

        for (const {x, y} of moves)
        {
            const ww = w-x;
            const hh = h-y;
            if (hh < 0 || ww < 0)
                continue;

            map[ww][hh] = (map[ww][hh] + value) % MODULO;
        }
    }

    const size = Math.max(W, H);

    // Above Diagonal
    if (trace)
        console.log('Above Diagonal');

    for (let i = size; i >= 0; i--)
    {
        // if (trace)
        //     process.stdout.write(`\r${i} `);
        for (let w = i, h = size; w <= size && h >= 0; w++, h--)
            processPoint(w, h);
    }

    if (trace)
        console.log('\rBelow Diagonal');
    // Below Diagonal
    for (let i = size-1; i >= 0; i--)
    {
        // if (trace)
        //     process.stdout.write(`\r${i} `);
        for (let h = i, w = 0; w <= size && h >= 0; w++, h--)
            processPoint(w, h);
    }
    if (trace)
        console.log('');

    return map[0][0];
}

assert.equal(F(3, 4), 278);
assert.equal(F(10, 10), 215846462);

let timer = process.hrtime();
const answer = F(MAX, MAX, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));

