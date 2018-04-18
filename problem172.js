// Investigating numbers with few repeated digits
// Problem 172 
// How many 18-digit numbers n (without leading zeros) are there such that no digit occurs more than three times in n?

const bigInt = require('big-integer');

function solve(length)
{
    let count = bigInt(0);
    let used  = [0,0,0,0,0,0,0,0,0,0];
    let memoize = {};

    function inner(position)
    {
        if (position === length)
        {
            count = count.plus(1);
            return;
        }
        let key     = position + '-' + used.toString();
        let result  = memoize[key];
        if (result !== undefined)
        {
            count = count.plus(result);
            return;
        } 
        let start = count;
        for(let d = 0; d <= 9; d++)
        {
            if (position === 0 && d === 0)
                continue;
            if (used[d] < 3)
            {
                used[d]++;
                inner(position+1);
                used[d]--;
            }
        }        
        memoize[key] = count.minus(start);
    }

    inner(0);

    return count;
}

// 89586

let max = solve(5);
console.log(max.toString() + " 5-digit numbers n (without leading zeros)");
max = solve(18);
console.log(max.toString() + " 18-digit numbers n (without leading zeros)");
