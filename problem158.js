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

let counts = [];

function solve(length, target)
{
    let used = [];
    let conditionMet = false;
    let value = [];

    function inner(conditionMet)
    {
        let len = value.length;
        if (conditionMet && len >= 2 && len <= length)
            counts[len]++;

        if (len === length)
            return;

        let previous = len > 0 ? value[len-1] : 27;

        for (let letter = 1; letter <= 26; letter++)
        {
            if (conditionMet && letter > previous)
                continue;

            if (used[letter] !== 1)
            {                
                used[letter] = 1;
                value.push(letter);

                inner(conditionMet || letter > previous);

                value.pop(letter);
                used[letter] = 0;
            }
        }
    }

    for (let i = 2; i <= length; i++)
        counts[i] = 0;
    
    inner(false);

    if (length >= 3)
        assert.equal(counts[3], 10400);

    let max = 0;
    for (let i = 2; i <= length; i++)
        if (counts[i] > max)
            max = counts[i];
    
    return max;
}

solve(3);

let maxTotal = solve(26);
console.log(maxTotal);