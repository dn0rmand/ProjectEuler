function prepare()
{
    let entries = {};
    let used    = [];
    let maxCount= 1;

    function inner(value, sum, length)
    {
        if (sum > 0)
        {
            if (sum <= 23)
            {
                let k = sum + ":" + (value % 23) + ":" + length;
                let entry = entries[k];

                if (entry !== undefined)
                {
                    entry.count++;
                    if (entry.count > maxCount)
                        maxCount = entry.count;
                }
                else
                {
                    entry = {
                        sum: sum,
                        modulo: value % 23,
                        length: length,
                        count: 1
                    };

                    entries[k] = entry;
                }
            }
            if (sum >= 23)
                return;
        }

        for (let d = 1; d < 10; d++)
        {
            if (! used[d])
            {
                used[d] = 1;
                inner((value * 10) + d, sum+d, length + 1);
                used[d] = 0;
            }
        }
    }

    inner(0, 0, 0);
    console.log(maxCount);
    return Object.values(entries);
}

let entries = prepare();

console.log(entries.length);