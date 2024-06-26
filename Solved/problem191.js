// Prize Strings
// -------------
// Problem 191 
// -----------
// A particular school offers cash rewards to children with good attendance and punctuality. 
// If they are absent for three consecutive days or late on more than one occasion then they forfeit their prize.

// During an n-day period a trinary string is formed for each child consisting of L's (late), O's (on time), 
// and A's (absent).

// Although there are eighty-one trinary strings for a 4-day period that can be formed, exactly forty-three strings 
// would lead to a prize:

// OOOO OOOA OOOL OOAO OOAA OOAL OOLO OOLA OAOO OAOA
// OAOL OAAO OAAL OALO OALA OLOO OLOA OLAO OLAA AOOO
// AOOA AOOL AOAO AOAA AOAL AOLO AOLA AAOO AAOA AAOL
// AALO AALA ALOO ALOA ALAO ALAA LOOO LOOA LOAO LOAA
// LAOO LAOA LAAO

// How many "prize" strings exist over a 30-day period?

const assert = require('assert');

function solve(days)
{
    let memoize = new Map();

    function get(beenLate, absent, length)
    {
        let k = length + 100*absent + (beenLate ? 1000 : 0);
        return memoize.get(k);
    }

    function set(beenLate, absent, length, count)
    {
        let k = length + 100*absent + (beenLate ? 1000 : 0);
        memoize.set(k, count);
    }
    
    function inner(beenLate, absent, length)
    {
        if (length === days)
            return 1;

        let count = get(beenLate, absent, length);

        if (count === undefined)
        {
            count = inner(beenLate, 0, length+1);
            if (absent < 2)
                count += inner(beenLate, absent+1, length+1);
            if (! beenLate)
                count += inner(true, 0, length+1);

            set(beenLate, absent, length, count);
            return count;
        }
        else
            return count;
    }

    let total = inner(false, 0, 0);

    return total;
}

assert.equal(solve(4), 43);

let answer = solve(30);
console.log('Answer to problem 191 is', answer);