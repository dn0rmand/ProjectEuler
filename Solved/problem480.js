// The Last Question
// -----------------
// Problem 480 
// -----------
// Consider all the words which can be formed by selecting letters, in any order, from the phrase:
//
// thereisasyetinsufficientdataforameaningfulanswer
//
// Suppose those with 15 letters or less are listed in alphabetical order and numbered sequentially starting at 1.
// The list would include:

// 1 : a
// 2 : aa
// 3 : aaa
// 4 : aaaa
// 5 : aaaaa
// 6 : aaaaaa
// 7 : aaaaaac
// 8 : aaaaaacd
// 9 : aaaaaacde
// 10 : aaaaaacdee
// 11 : aaaaaacdeee
// 12 : aaaaaacdeeee
// 13 : aaaaaacdeeeee
// 14 : aaaaaacdeeeeee
// 15 : aaaaaacdeeeeeef
// 16 : aaaaaacdeeeeeeg
// 17 : aaaaaacdeeeeeeh
// ...
// 28 : aaaaaacdeeeeeey
// 29 : aaaaaacdeeeeef
// 30 : aaaaaacdeeeeefe
// ...
// 115246685191495242: euleoywuttttsss
// 115246685191495243: euler
// 115246685191495244: eulera
// ...
// 525069350231428029: ywuuttttssssrrr
// Define P(w) as the position of the word w.
// Define W(p) as the word in position p.
// We can see that P(w) and W(p) are inverses: P(W(p)) = p and W(P(w)) = w.

// Examples:

// W(10) = aaaaaacdee
// P(aaaaaacdee) = 10
// W(115246685191495243) = euler
// P(euler) = 115246685191495243
// Find W(P(legionary) + P(calorimeters) - P(annihilate) + P(orchestrated) - P(fluttering)).
// Give your answer using lowercase characters (no punctuation or space).

const STRING = "thereisasyetinsufficientdataforameaningfulanswer";
const FIRST_LETTER = "a".charCodeAt(0);
const LAST_LETTER = "z".charCodeAt(0);

const bigInt = require('big-integer');
const assert = require('assert');

let characters = {};

function clone(v)
{
    let n = {};

    for (let k of Object.keys(v))
        n[k] = v[k];

    return n;
}

function initialize()
{
    let letters = STRING.split('').sort();

    let last = undefined;
    let count= 0;

    for (let c of letters)
    {
        if (last === c)
            count++;
        else if (count > 0)
        {
            characters[last] = count;
            last = c;
            count = 1;
        }
        else 
        {
            last = c;
            count = 1;
        }
    }
    if (count > 0)
        characters[last] = count;
}

initialize();

const memoize = new Map();

function countWords(prefix)
{
    if (prefix.length >= 15)
        return 0;

    let key   = Object.values(characters).sort().join('');
    let total = memoize.get(key);

    if (total !== undefined)
        return total;
    total = bigInt.zero;

    for (let next = FIRST_LETTER; next <= LAST_LETTER; next++)
    {
        let nextLetter = String.fromCharCode(next);
        let count = characters[nextLetter];
        if (count)
        {
            characters[nextLetter] = count-1;
            total = total.plus(1).plus(countWords(prefix + nextLetter));
            characters[nextLetter] = count;
        }
    }

    memoize.set(key, total);
    return total;
}

function P(word)
{
    let old = clone(characters);
    let index  = bigInt.zero;
    let prefix = '';

    try
    {
        for (let c of word)
        {
            let ccount = characters[c];
            if (! ccount)
                return -1;

            for (let letter = FIRST_LETTER; letter < c.charCodeAt(0); letter++)
            {
                let v = String.fromCharCode(letter);
                let count = characters[v];
                if (count)
                {
                    characters[v] = count-1;
                    index = index.plus(1).plus(countWords(prefix + v));
                    characters[v] = count;
                }
            }
            characters[c]--;
            index = index.next();
            prefix += c;
        }
    }
    finally
    {
        characters = old;
    }
    return index;
}

function W(index, prefix)
{
    prefix = prefix || '';

    let previous = undefined;
    let found    = false;
    for (let letter = FIRST_LETTER; letter <= LAST_LETTER; letter++)
    {
        let c = String.fromCharCode(letter);
        let idx = P(prefix + c);
        if (idx === -1)
            continue; /// That letter doesn't exist!
        if (idx.eq(index))
            return prefix+c;
        if (idx.greater(index))
        {
            found = true;
            break;
        }
        else
            previous = c;
    }
    if (! found || previous === undefined)
        throw "No Solution";
    
    return W(index, prefix + previous);
}

function allWordsCount()
{
    let total = bigInt.zero;
    for (let letter = FIRST_LETTER; letter <= LAST_LETTER; letter++)
    {
        let c = String.fromCharCode(letter);
        let count = characters[c];
        if (count)
        {
            characters[c] = count-1;
            total = total.plus(1).plus(countWords(c));
            characters[c] = count;
        }
    }
    return total;
}

function solve()
{
    let idx1 = P("legionary");
    let idx2 = P("calorimeters");
    let idx3 = P("annihilate");
    let idx4 = P("orchestrated");
    let idx5 = P("fluttering");

    let index = idx1.plus(idx2).minus(idx3).plus(idx4).minus(idx5);

    // console.log("P(legionary) + P(calorimeters) - P(annihilate) + P(orchestrated) - P(fluttering) =", index.toString());

    let word = W(index);
    return word;
}

assert.equal(allWordsCount().toString(), "525069350231428029");
assert.equal(P("aaaaaacdee").toString(), "10");
assert.equal(P("euler").toString(), "115246685191495243");

let answer = solve();

// console.log(P('turnthestarson').minus(index).toString());

console.log('Answer is', answer);