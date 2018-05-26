// Migrating ants
// --------------
// Problem 393 
// -----------
// An n×n grid of squares contains n2 ants, one ant per square.
// All ants decide to move simultaneously to an adjacent square (usually 4 possibilities, except for ants on the edge of 
// the grid or at the corners).
// We define f(n) to be the number of ways this can happen without any ants ending on the same square and without any 
// two ants crossing the same edge between two squares.

// You are given that f(4) = 88.
// Find f(10).

const assert = require('assert');

function process(visited, size)
{
    let total = 0;
    let startX = -1;
    let startY = -1;
    let SIZE = 0;

    // let s = "";
    for (let i = 0; i < visited.length; i++)
    {
        // if ((i % size) === 0)
        // {
        //     console.log(s);
        //     s = "";
        // }
        
        if (visited[i] !== 1)
        {
            // s += ".";
            if (SIZE === 0)
            {
                startY = i % size;
                startX = (i - startY) / size;
            }
            
            SIZE++;
        }
        // else
        //     s += "*";
    }
    // console.log(s);
    // console.log('----')
    if (SIZE <= 3)
        return 0;
    
    inner(startX, startY, 0);

    return total;

    function inner(x, y, count)
    {
        if (x < 0 || x >= size || y < 0 || y >= size)
            return;

        if (x === startX && y === startY && count > 3)
        {
            if (count === SIZE)
            {
                total++;
                return;
            }
            else
            {
                total += process(visited, size);
            }
        }

        let k = (x * size) + y;

        if (visited[k] === 1)
            return;

        visited[k] = 1;
        inner(x, y+1, count+1);
        inner(x, y-1, count+1);
        inner(x+1, y, count+1);
        inner(x-1, y, count+1);
        visited[k] = 0;
    }

    inner(0, 0, 0);

    return total;
}

function f(size)
{
    let visited = [];

    for (let i = 0; i < size*size; i++)
        visited.push(0);

    let total = process(visited, size);
    return total;
}

// console.log(f(2));
// console.log(f(3));
console.log(f(4));
console.log(f(6));
console.log(f(8));

//assert.equal(f(4), 88);

// console.log(f(3));
// console.log(f(4));
// console.log(f(10));
// console.log(f(6));

/*
+---+---+---+
| A | B | C |
+---+---+---+
| D | E | F |
+---+---+---+
| G | H | I |
+---+---+---+
*/