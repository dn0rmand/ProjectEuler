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

class Factorials
{
    constructor()
    {
        this.memoize = [];
    }

    getEven(n)
    {
        if (n < 2)
            return 1;

        let index = n / 2;
        let v = this.memoize[index];
        if (v !== undefined)
            return v;

        let total = bigInt.one;

        for (let i = 2; i <= n; i += 2)
        {
            total = total.times(i-1).times(i).mod(MODULO);
            this.memoize[i/2] = total.valueOf();
        }

        return total.valueOf();
    }

    getOdd(n)
    {
        if (n < 2)
            return 1;

        let v1 = this.getEven(n-1);
        let v2 = bigInt(n).times(v1).mod(MODULO).valueOf();

        return v2;
    }

    get(n)
    {
        if ((n & 1) === 0)
            return this.getEven(n);
        else
            return this.getOdd(n);
    }
}

function f(size)
{
    let factorials = new Factorials();

    let total = factorials.get(size);

    let exclude = 1;

    for (let i = 1; i < size; i++)
    {
        let f1 = factorials.get(i);
        let f2 = factorials.get(size-i-1);

        let v1 = (f1 * 2) % MODULO;
        let v2 = f2 * i;

        if (v2 > Number.MAX_SAFE_INTEGER)
            v2 = bigInt(f2).times(i).mod(MODULO).valueOf();
        else
            v2 = v2 % MODULO;

        exclude = (exclude + v1 - v2) % MODULO;
    }

    total = (total - exclude) % MODULO;
    while (total < 0)
        total += MODULO;

    return total;
}

assert.equal(f(3), 2);
assert.equal(f(4), 12);
assert.equal(f(5), 70);
assert.equal(f(6), 464);
assert.equal(f(7), 3498);

let answer = f(MAX);

console.log("Answer is", answer);
