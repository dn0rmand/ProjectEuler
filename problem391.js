// Hopping Game
// ------------
// Problem 391 
// -----------
// Let sk be the number of 1’s when writing the numbers from 0 to k in binary.
// For example, writing 0 to 5 in binary, we have 0, 1, 10, 11, 100, 101. There are seven 1’s, so s5 = 7.
// The sequence S = {sk : k ≥ 0} starts {0, 1, 2, 4, 5, 7, 9, 12, ...}.

// A game is played by two players. Before the game starts, a number n is chosen. A counter c starts at 0. 
// At each turn, the player chooses a number from 1 to n (inclusive) and increases c by that number. 
// The resulting value of c must be a member of S. If there are no more valid moves, the player loses.

// For example:
// Let n = 5. c starts at 0.
// Player 1 chooses 4, so c becomes 0 + 4 = 4.
// Player 2 chooses 5, so c becomes 4 + 5 = 9.
// Player 1 chooses 3, so c becomes 9 + 3 = 12.
// etc.
// Note that c must always belong to S, and each player can increase c by at most n.

// Let M(n) be the highest number the first player can choose at her first turn to force a win, 
// and M(n) = 0 if there is no such move. For example, M(2) = 2, M(7) = 1 and M(20) = 4.

// Given Σ(M(n))3 = 8150 for 1 ≤ n ≤ 20.

// Find Σ(M(n))3 for 1 ≤ n ≤ 1000.

const assert = require('assert');

const MAX = 1000;

const S = new Map();

const state = {
    n: 0,
    last: 0
};

function buildS(max)
{
    while (state.last <= max)
    {        
        let x = state.n++;
        while (x > 0)
        {
            let d = (x % 2);
            x = (x-d) / 2;
            if (d !== 0)
                state.last++;
        }
        S.set(state.last, state.n-1);
    }
}

buildS(736176); 

function isValid(c)
{
    // if (c > state.last)
    // {
    //     buildS(c);
    // }

    return S.has(c);
}

function M(n, reverse, start)
{
    let memoize = new Map();

    function $winningPosition(c)
    {
        let player1 = false;
        let stack   = [];
        let losingChoices = [];
        let hasMoves = false;

        let start = n;

        while(true)
        {
            for(let m = start; m > 0; m--)
            {
                let newC = c + m;
                if (! isValid(newC))
                    continue;
                
                stack.push({m: m-1, c:c, hasMoves: true, player: player1});
                c = newC;
                m = n+1;
            }

            if (player1)
            {
                memoize.set(-c, false);
            }
            else
            {
                memoize.set(c, true);
            }

            if (stack.length === 0)
                break;

            let s = stack.pop();
            c = s.c;
            start = s.m;
        }

        for(let m = n; m > 0; m--)
        {
            if (memoize.get(c+m) === true)
                return false;
        }
        return true;
    }

    function winningPosition(c, player1)
    {
        let key = player1 ? -c : c;

        let v = memoize.get(key);
        if (v !== undefined)
            return v;

        for (let m = n; m > 0; m--)
        {
            let newC = c + m;
            if (! isValid(newC))
                continue;
            
            let win = winningPosition(newC, ! player1);

            if (player1 && win)
            {
                memoize.set(key, true);
                return true;
            }
            else if (! player1 && ! win)
            {
                memoize.set(key, false);
                return false;
            }
        }    

        memoize.set(key, ! player1);
        return ! player1;    
    }

    if (start === undefined)
        start = 0;

    for (let c = n; c > 0; c--)
    {
        if (! isValid(c + start))
            continue;

        if (reverse)
        {
            let x = M(n, false, c+start);
            if (x !== 0)
                return c;
        }
        else if (winningPosition(c+start, false))
        {
            return c;
        }
    }

    return 0;
}

function solve(value)
{
    let total = 0;
    for(let n = 1; n <= value; n++)
    {
        let v = M(n);
        total += (v*v*v);
    }

    return total;
}

for (let i = 33; ; i++)
{
    let v1 = M(i, false);
    let v2 = M(i, true);

    if (v1 === 0 || i === 8 || i === 16)
    {
        console.log("M(" + i + ") -> " + S.get(v1) + " - " + S.get(v2));
        if (v1 === 0)
            break;
    }
}

// assert.equal(M(20), 4);

// assert.equal(M(2), 2);
// assert.equal(M(7), 1);

// assert.equal(solve(10), 683);
// assert.equal(solve(13), 3287);
// assert.equal(solve(20), 8150);

// let answer = solve(MAX);

// console.log("Answer is " + answer + " (61029882288)");
