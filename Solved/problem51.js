const primes = require("../tools/primes.js");

function findPattern(cache, size, positionCount)
{
    function *getPositions(pos)
    {
        if (pos.length === positionCount)
        {
            yield pos;
            return;
        }
        let minPos = 0;
        let max    = size-(positionCount-1) + pos.length;
        if (pos.length > 0)
            minPos = pos[pos.length-1]+1;

        for (let p = minPos; p < max; p++)
        {
            pos.push(p);
            yield *getPositions(pos);
            pos.pop();
        }
    }

    function setDigit(value, digit, position)
    {
        let mod1 = Math.pow(10, position);
        let mod2 = mod1 * 10;
    
        let mask     = value - (value % mod2) + (value % mod1);
        let newValue = mask + (digit * mod1);

        return newValue;
    }

    let max = 0;
    let minPrime = -1;

    for (let prime of cache.keys())
    {
        let positions = getPositions([]);

        for(let position of positions)
        {
            let count = 0;
            let minP  = -1;
            for(let digit = 1; digit <= 9; digit++)
            {
                let newValue = prime;
                for(let i = 0; i < position.length; i++)
                    newValue = setDigit(newValue, digit, position[i]);

                if (cache.has(newValue)) // Is it a prime?
                {
                    if (count === 0)
                        minP = newValue;
                    else
                        minP = Math.min(newValue, minP);

                    count++;
                }
            }

            if (count > max)
            {
                max = count;
                minPrime = minP;
                if (max >= 8)
                    return minPrime;
            }
        }
    }

    if (max >= 8)
        return minPrime;
    else
        return 0;
}

let iterator = primes();
let size  = 5;
let max   = 100000;

let current = iterator.next();
while (current.value < max)
    current = iterator.next();

while (true)
{
    size++;

    max *= 10;

    let cache = new Map();
    let digits= 0;
    while (current.value < max)
    {
        cache.set(current.value, current.value);
        current = iterator.next();
    }

    let foundValue = 0;
    for (let p = 1; p < size; p++)
    {
        foundValue = findPattern(cache, size, p);
        if (foundValue > 0)        
            break;
    }
    if (foundValue)
    {
        console.log('Smallest prime part of an eight prime value family is ' + foundValue);
        break;
    }
}
