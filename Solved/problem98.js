const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p098_words.txt')
});

const anagrams = {};
let maxSquare = 0;

function isSquare(word, map)
{
    let value = 0;
    for (let c of word)
    {
        let d = map[c];
        value = (value * 10) + d;
        if (value === 0) // Leading 0
            return;
    }

    let root = Math.sqrt(value);
    if (Math.floor(root) === root)
        return value;
}

function *findSquare(words, index, map, digits)
{
    if (index >= words[0].length)
    {
        let square1 = isSquare(words[0], map);
        if (square1 !== undefined)
        {
            let square2 = isSquare(words[1], map);
            if (square2 !== undefined)
            {
                yield Math.max(square1, square2);
            }
        } 
    }
    else
    {
        let c = words[0][index];
        let d = map[c];
        if (d !== undefined)
        {
            digits.push(d);
            yield *findSquare(words, index+1, map, digits);
            digits.pop();
        }
        else
        {            
            for (let d = index === 0 ? 1 : 0; d <= 9; d++)
            {
                if (digits.includes(d))
                    continue;
                digits.push(d);
                map[c] = d;
                yield *findSquare(words, index+1, map, digits);
                map[c] = undefined;
                digits.pop();
            }
        }
    }
}

function solve(anagrams)
{
    for (let square of findSquare(anagrams, 0, {}, []))
    {
        // console.log(anagrams[0] + ' -> ' + square);
        if (square > maxSquare)
            maxSquare = square;
    }
}

readInput
.on('line', (input) => { 
    let words = input.split(',');
    for(let w of words)
    {
        var word = w.substring(1, w.length-1);

        let key = word.split('').sort().join('');
        if (anagrams[key] === undefined)
            anagrams[key] = [];

        anagrams[key].push(word);
    }
})

.on('close', () => {
    // Filter out the non-anagram word
    for(let k of Object.keys(anagrams))
    {
        if (anagrams[k].length < 2)
            delete anagrams[k];
        else if (anagrams[k].length === 2)
            solve(anagrams[k]);
        else 
        {
            let a = anagrams[k];
            if (a.length !== 3)
                throw "What! someone is messing with the input file";
            solve([a[0], a[1]]);
            solve([a[1], a[2]]);
            solve([a[0], a[2]]);
        }
    }
    console.log(maxSquare + " is the largest square number formed by any member of found pairs.");
    process.exit(0);
});
