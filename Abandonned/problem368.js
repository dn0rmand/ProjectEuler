function addDigits(from)
{
    const   to    = {};
    let     sum   = 0;
    let     count = 0;

    function writeTo(index, value)
    {
        let b = to[index];
        if (! b)
            to[index] = b = new Set();
        
        b.add(value);
        sum += 1/value;
        count++;
    };

    for(let d = 0; d < 10; d++)
    {        
        let D  = d + "";
        let DD = D + "" + d;

        for (let i in from)
        {
            let f = from[i];
            if (! f)
                continue;

            if (i === D)
            {
                // goes to dd
                for(let value of f)
                {
                    writeTo(DD, (value * 10)+d);
                }
            }
            else if (i === DD)
            {
                // goes to nowhere
            }
            else
            {
                // goes to d bucket
                for(let value of f)
                {
                    writeTo(D, (value * 10)+d);
                }
            }
        }
    }

    return [to, count, sum];
}

function solve(maxDigits)
{
    let buckets = {};
    let count   = 9;
    let sum     = 0;

    for(let d = 1; d < 10; d++)
    {
        buckets[d] = new Set([d]);
        sum += 1/d;
    }

    console.log(count, sum);

    for(let i = 1; i < maxDigits; i++)
    {
        let subSum;
        [buckets, count, subSum] = addDigits(buckets);
        sum += subSum
        console.log(count, sum, subSum);
    }
}

solve(10);