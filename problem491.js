// Double pandigital number divisible by 11
// ----------------------------------------
// Problem 491 
// -----------
// We call a positive integer double pandigital if it uses all the digits 0 to 9 exactly twice (with no leading zero). 
// For example, 40561817703823564929 is one such number.

// How many double pandigital numbers are divisible by 11?

const bigInt = require('big-integer');

function solve()
{
    let used = [0,0,0,0,0,0,0,0,0,0];
    let memoize = new Map();

    function get(value, sign)
    {
        let key = (sign * value) + used.join(''); 

        let v = memoize.get(key);
        return v;
    }

    function set(value, sign, total)
    {
        let key = (sign * value) + used.join(''); 

        memoize.set(key, total);
    }

    function inner(value, sign, length)
    {
        if (length === 20)
        {
            if (value < 0)
                value = -value;
            if (value % 11 === 0)
                return 1;
            else
                return 0;
        }

        let saved = get(value, sign);
        if (saved !== undefined)
            return saved;

        let start = length === 0 ? 1 : 0;        
        let total = 0;

        for (let d = start; d < 10; d++)
        {
            if (used[d] === 2)
                continue;

            used[d]++;
            let v = value + (sign * d);
            total += inner(v, -sign, length+1);
            used[d]--;
        }

        set(value, sign, total);

        return total;
    }

    let t = inner(0, 1, 0);
    return t;
}

let answer = solve();
console.log(answer, "double pandigital numbers are divisible by 11");