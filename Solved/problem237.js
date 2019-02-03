const assert = require('assert');

const MODULO = 1E8;
const MODULO_N = BigInt(MODULO);

const MAX    = 1E12;

function generateStates()
{
    let visited = [[], [], [], []];
    let visitedCount = 0

    const states = { }

    function isVisited(x, y)
    {
        return visited[y][x];
    }

    function visite(x, y)
    {
        visited[y][x] = ++visitedCount;
    }

    function unVisite(x, y)
    {
        visited[y][x] = 0;
        visitedCount--;
    }

    function getValue(x, y)
    {
        if (x < 0 || y < 0 || y > 3)
            return -1;
        return visited[y][x] || -1;
    }

    function getChar(x, y)
    {
        if (x === 0 && y === 3)
            return '.';

        let v = getValue(x, y);
        if (getValue(x-1, y) === v+1)
            return '<';
        if (getValue(x+1, y) === v+1)
            return '>'
        if (getValue(x, y-1) === v+1)
            return '^'
        if (getValue(x, y+1) === v+1)
            return 'v'
        return '?';
    }

    function T(n)
    {
        let total = 4*n;
        let count = 0;

        visitedCount = 0;
        visited      = [[], [], [], []];

        function inner(x, y)
        {
            if (x < 0 || x >= n || y < 0 || y > 3)
                return;

            if (x === 0 && y === 3)
            {
                if (total === visitedCount+1)
                {
                    count++;
                    visite(x, y);
                    for (let xx = 0; xx < n-1; xx++)
                    {
                        let s1 = getChar(xx+0, 0) + getChar(xx+0, 1) + getChar(xx+0, 2) + getChar(xx+0, 3);
                        let s2 = getChar(xx+1, 0) + getChar(xx+1, 1) + getChar(xx+1, 2) + getChar(xx+1, 3);

                        let k = s1 + "," + s2;

                        if (states[s2] === undefined)
                            states[s2] = { start: false, end: false, moves:[] };

                        if (states[s1] === undefined)
                            states[s1] = { start: false, end: false, moves:[] };

                        if (xx === n-2)
                            states[s2].end = true;
                        if (xx === 0)
                            states[s1].start= true;

                        if (! states[s2].moves.includes(s1))
                        {
                            states[s2].moves.push(s1);
                        }
                    }
                    unVisite(x, y);
                }
                return;
            }

            if (isVisited(x, y))
                return;

            visite(x, y);
            inner(x+1, y)
            inner(x-1, y)
            inner(x, y+1)
            inner(x, y-1)
            unVisite(x, y);
        }

        inner(0, 0);
        console.log(count);
    }

    T(6); // 6 minimum to get all possible states+moves

    let keys = Object.keys(states);
    for (let s2 of keys)
    {
        for (let s1 of states[s2].moves)
        {
            for (let i = 0; i < 4; i++)
            {
                console.log(s1[i]+s2[i]);
            }
            console.log('');
        }
    }
    return states;
}

function $solve(states, n)
{
    if (n < 5)
        throw "Not interested in small numbers :)"

    let keys = Object.keys(states);
    let current = {};
    for (let s of keys)
    {
        if (states[s].end)
            current[s] = 1;
    }

    for (let x = 1; x < n; x++)
    {
        let newStates = {};
        for(let s of Object.keys(current))
        {
            for (let move of states[s].moves)
            {
                if (newStates[move] === undefined)
                    newStates[move] = 0;
                newStates[move] = (newStates[move] + current[s]) % MODULO;
            }
        }

        current = newStates;
    }

    let total = 0;

    for(let s of Object.keys(current))
        if (states[s].start)
            total = (total + current[s]) % MODULO;
        else
            delete current[s];

    console.log(total);
    return total;
}

function solve(n)
{
    const OFFSET = 620000000; // Magical repeat sequence.

    let a0= 1;
    let a1= 1;
    let a2= 4;
    let a3= 8;

    let a = 2*(a3 + a2 - a1) + a0;

    function inner()
    {
        a0 = a1;
        a1 = a2;
        a2 = a3;
        a3 = a;

        a  = 2*(a3 + a2 - a1) + a0;

        while (a < 0)
            a += MODULO;
        while (a >= MODULO)
            a -= MODULO;
    }

    let i = 6;

    // Move some. I'm sure it's not required
    while (i <= 1000 && i <= n)
    {
        inner();
        i++;
    }

    // Skip lots
    while (i + OFFSET <= n)
        i += OFFSET;

    // Finish up
    while (i <= n)
    {
        inner();
        i++;
    }

    return a;
}

// let states = generateStates();
// $solve(states, 6);

console.log('Use formula from https://oeis.org/A181688');

assert.equal(solve(10), 2329);
assert.equal(solve(1000), 64570120);
assert.equal(solve(10000), 88946736);
assert.equal(solve(15684747), 99072548);
assert.equal(solve(620023456), 34453088)

console.log('tests passed');

let answer = solve(MAX);
console.log('Answer is', answer);


