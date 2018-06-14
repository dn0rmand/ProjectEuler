// Open chess positions
// --------------------
// Problem 628 
// -----------
// A position in chess is an (orientated) arrangement of chess pieces placed on a chessboard of given size. 
// In the following, we consider all positions in which n pawns are placed on a n×n board in such a way, that 
// there is a single pawn in every row and every column.

// We call such a position an open position, if a rook, starting at the (empty) lower left corner and using only moves 
// towards the right or upwards, can reach the upper right corner without moving onto any field occupied by a pawn.

// Let f(n) be the number of open positions for a n×n chessboard.
// For example, f(3)=2, illustrated by the two open positions for a 3×3 chessboard below.

// You are also given f(5)=70.

// Find f(10^8) modulo 1008691207.

const assert = require('assert');
const bigInt = require('big-integer');

const MODULO = 1008691207;
const MAX    = 100000000;

function factorial(n)
{
    if (n < 1)
        return bigInt(1);

    let total = bigInt(1);

    for (let i = 2; i <= n; i++)
    {
        total = total.times(i);
    }

    return total;
}

function f(size)
{
    let total = factorial(size);

    total = total.minus(1); // all in a diagonal

    for (let i = 1; i < size; i++)
    {
        let bads = factorial(size-i);

        total = total.minus(bads.times(2));
    }    

    // Re-add duplicates

    for (let i = 1; i < size; i++)
    {
        for (let j = 1; j <= i; j++)
        {
            let dupl = factorial(size - (i+i));
            total = total.add(dupl);
        }
    }
    return total.valueOf();
}

console.log('f(3) =', f(3), ', should be', 2);
console.log('f(4) =', f(4), ', should be', 12);
console.log('f(5) =', f(5), ', should be', 70);
console.log('f(6) =', f(6), ', should be', 464);
console.log('f(7) =', f(7), ', should be', 3498);

// console.log(f(MAX));
/*
+---+---+---+---+
|   |45 |35 |21 |
+---+---+---+---+
|   |23 |41 |56 |
+---+---+---+---+
|   |15 |25 |43 |
+---+---+---+---+
| x |   |   |   |
+---+---+---+---+

+---+---+---+---+
|   |   | 2 | 1 |
+---+---+---+---+
|   |   | 1 | 2 |
+---+---+---+---+
| x |   |   |   |
+---+---+---+---+
|   | x |   |   |
+---+---+---+---+

+---+---+---+---+
|   |   |   | 1 |
+---+---+---+---+
| x |   |   |   |
+---+---+---+---+
|   | x |   |   |
+---+---+---+---+
|   |   | x |   |
+---+---+---+---+

+---+---+---+---+
| x |   |   |   |
+---+---+---+---+
|   | x |   |   |
+---+---+---+---+
|   |   | x |   |
+---+---+---+---+
|   |   |   | x |
+---+---+---+---+

*/