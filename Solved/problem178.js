const timerLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

function count(size)
{
    const used = new Array(10).fill(0);

    const memoize = new Map();

    function makeKey(lastDigit, size)
    {
        let digits = used.map((v) => v > 0 ? 1 : 0);
        return `${size}:${lastDigit}:${digits.join('')}`;
    }

    function inner(lastDigit, sz)
    {
        if (lastDigit > 9 || lastDigit < 0)
            return 0;

        try
        {
            used[lastDigit]++;
            let k = makeKey(lastDigit, sz);
            let t = memoize.get(k);
            if (t !== undefined)
                return t;

            if (sz === 0)
            {
                t = 1;
                for(let i = 0; i < 10; i++)
                    if (used[i] < 1)
                    {
                        t = 0;
                    }
                memoize.set(k, t);
                return t;
            }
            else
            {
                t = inner(lastDigit-1, sz-1) + inner(lastDigit+1, sz-1);
                memoize.set(k, t);
                return t;
            }
        }
        finally
        {
            used[lastDigit]--;
        }
    }

    let total = 0;

    for(let d = 1; d < 10; d++)
    {
        total += inner(d, size-1, []);
    }

    return total;
}

function solve(maxSize)
{
    let total = 0;
    for (let size = 10; size <= maxSize; size++)
    {
        total += count(size);
    }
    return total;
}

const answer = timerLogger.wrap('', () => solve(40));

console.log(`Answer is ${answer}`);