// Exploring strings for which only one character comes lexicographically after its neighbour to the left
// ------------------------------------------------------------------------------------------------------
// Problem 158 
// Taking three different letters from the 26 letters of the alphabet, character strings of length three can be formed.
// Examples are 'abc', 'hat' and 'zyx'.
// When we study these three examples we see that for 'abc' two characters come lexicographically after its neighbour to 
// the left.
// For 'hat' there is exactly one character that comes lexicographically after its neighbour to the left. For 'zyx' there 
// are zero characters that come lexicographically after its neighbour to the left.
// In all there are 10400 strings of length 3 for which exactly one character comes lexicographically after its neighbour 
// to the left.

// We now consider strings of n ≤ 26 different characters from the alphabet.
// For every n, p(n) is the number of strings of length n for which exactly one character comes lexicographically after 
// its neighbour to the left.

// What is the maximum value of p(n)?

const assert = require('assert');

function solve(length)
{
    let used  = [];
    let counts= [];
    for (let i = 0; i <= 26; i++)
        counts[i] = 0;

    function inner(pos, last, met)
    {
        if (met && pos >= 2)
            counts[pos]++;

        if (pos === length)
            return;

        if (pos === 1)
            console.log(last);

        // continue not metting the condition
        for (let letter = 1; letter < last; letter++)
        {
            if (used[letter] !== 1)
            {
                used[letter] = 1;
                inner(pos+1, letter, met);
                used[letter] = 0;
            }
        }

        // condition not met so we can use next letters
        if (! met)
        {
            for(let letter = last+1; letter <= 26; letter++)
            {
                if (used[letter] !== 1)
                {
                    used[letter] = 1;
                    inner(pos+1, letter, true);
                    used[letter] = 0;
                }
            }
        }
    }

    inner(0, 27, false);

    assert(counts[3], 10400);

    let max = 0;

    for (let i = 0; i <= 26; i++)
        if (counts[i] > max)
            max = counts[i];

    return max;
}

// Loop on string length N. For a given string length N there are N-1 places you can have the 1 increasing number. 
// Loop on that. Then the number that is after the increase, call it M, has a number of possible values 
// (<<26 based on # numbers before/after). Loop on that.  
// Then the downward string before the increasing number can be partitioned into numbers >M 
// (must be all of them for string length 26, could be a subset on smaller strings) and numbers <M. 
// Loop on count >M. 
// Gives you 3 strings with different numbers which are pure descending. 
// Normal combinatorials to compute number of ways those can exist.

assert(solve(3), 10400);

let maxTotal = solve(26);
console.log(maxTotal);