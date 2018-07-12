const bigNumber = require('bignumber.js');
const MAX_CYCLE_LENGTH  = 1000;
const DECIMALS          = (MAX_CYCLE_LENGTH * 4)+1;

bigNumber.set({ 
    ROUNDING_MODE: 1,
    DECIMAL_PLACES: DECIMALS
});

function getValue(dividor)
{
    let one = new bigNumber(1);
    let value = one.dividedBy(dividor);
    return value;    
}

function findCycle(str)
{
    function isCycle(index, length)
    {
        let i = index+length;
        while (i < (str.length - length))
        {
            for (let j = 0; j < length; j++)
            {
                if (str[index+j] !== str[i+j])
                    return false;
            }
            i += length;
        }

        return true;
    }

    for (let length = 1; length <= MAX_CYCLE_LENGTH; length++)
    {
        for(let index = 0; index <= 2*MAX_CYCLE_LENGTH; index++)
        {
            if (isCycle(index, length))
            {
                return { 
                    index: index, 
                    length:length,
                    cycle: str.substring(index, index+length)
                };
            }
        }
    }    
}

function toCycle(value)
{
    let str = value.toString().substring(2);

    if (str.length >= DECIMALS)
    {
        // Could be cycling
        let cycle = findCycle(str);
        if (cycle !== undefined)
        {
            cycle.str = "0." + str.substring(0, cycle.index) + "(" + cycle.cycle + ")";
            return cycle;
        }
    }

    return { str: "0." + str, length:0 };
}

let max = { str:"0", length:0 };
let count=0;

for(let i = 2; i <= 1000; i++)
{
    let v     = getValue(i);
    let cycle = toCycle(v);

    if (cycle.length > max.length)
    {
        count = 1;
        max   = cycle;
        max.value = i;
    }
    else if (cycle.length === max.length)
        count++;
}

if (count !== 1)
    throw "Multiple values found!";

console.log("Value of d < 1000 for which 1/d contains the longest recurring cycle in its decimal fraction part is");
console.log(max.value + " with a cycle of " + max.length + " digits");

