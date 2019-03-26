const assert = require('assert');

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

    for (let x = 0; x <= W; x++)
    {
        map.push(new Uint32Array(H+1));
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

    let states = [{w:W, h:H}];

    while (states.length > 0)
    {
        let visited   = createMap(W, H);
        let newStates = [];

        let count = 0;
        for (let i = 0; i < states.length; i++)
        {
            let state = states[i];

            if (trace)
            {
                if (count === 0)
                    process.stdout.write(`\r${states.length} / ${i}`);
                if (++count === 10000)
                    count = 0
            }

            state.value = map[state.w][state.h];
            if (state.w !== state.h)
                state.value = (state.value + map[state.h][state.w]) % MODULO;

            if (state.h !== 0 || state.w !== 0)
            {
                map[state.w][state.h] = 0;
                map[state.h][state.w] = 0;
            }
        }

        if (trace)
            process.stdout.write(`\r${states.length}               `);

        count = 0;
        for (let i = 0; i < states.length; i++)
        {
            let {w, h, value} = states[i];

            if (trace)
            {
                if (count === 0)
                    process.stdout.write(`\r${states.length} / ${i}`);
                if (++count === 10000)
                    count = 0
            }

            if (w === 0 && h === 0)
                continue;

            for (let {x, y} of moves)
            {
                let ww = w-x;
                let hh = h-y;
                if (hh < 0 || ww < 0)
                    continue;

                map[ww][hh] = (map[ww][hh] + value) % MODULO;

                if (! visited[ww][hh] && ! visited[[hh][ww]])
                {
                    visited[ww][hh] = 1;
                    newStates.push({w:ww, h:hh, value:0});
                }
            }
        }

        states = newStates;
    }
    if (trace)
        console.log('');

    return map[0][0];
}

//assert.equal(F(3, 4), 278);
assert.equal(F(10, 10), 215846462);

const answer = F(MAX, MAX, true);
console.log('Answer is', answer);
