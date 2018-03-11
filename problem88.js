const assert = require('assert');

function minProductSum(size)
{
    let values   = new Array(size);
    let minIndex = size;

    function productMatchSum()
    {        
        let p = 1;
        let s = minIndex;

        // Everything up to minIndex is 1

        for(let i = minIndex; i < size; i++)
        {
            let v = values[i];
            s += v;
            p *= v;
        }
        
        if (p === s)
            return s;
        
        // Check Stop
        p /= values[size-1];
        if (p > size)
            return -1;

        // if (s > 2*size)
        //     return -1;

        return 0;
    }

    function next()
    {
        let index = size-1;
        while (true)
        {
            let v = values[index];
            if (v < size)
            {
                values[index] = v+1;
                if (index < minIndex)
                    minIndex = index;
                return true;
            }
            else if (index > 0)
            {
                index--;
                let v = values[index];
                if (v < size)
                {
                    v++;
                    values[index] = v;

                    if (index < minIndex)
                        minIndex = index;

                    for(let i = index+1; i < size; i++)
                    {
                        values[i] = v;
                    }
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
    }

    values.fill(1);

    let min = -1;

    do
    {
        let result = productMatchSum();
        if (result < 0) // Need to stop looking
            break;

        if (result > 0 && (min === -1 || result < min))
            min = result;   
    }
    while (next());
    return min;
}

function solve(min, max)
{
    let sums = [];

    for(let n = min; n <= max; n++)
    {
        let s = minProductSum(n);
        // console.log(n + ' -> ' + s);
        sums.push(s);
    }

    sums.sort((a, b) => { return a-b; });

    let sum = 0;
    let previous = 0;
    for (let s of sums)
    {
        if (s != previous)
        {
            sum += s;
            previous = s;
        }
    }

    return sum;
}

assert.equal(minProductSum(2), 4);
assert.equal(minProductSum(3), 6);
assert.equal(minProductSum(4), 8);
assert.equal(minProductSum(5), 8);
assert.equal(minProductSum(6), 12);
assert.equal(minProductSum(7), 12);
assert.equal(minProductSum(8), 12);
assert.equal(minProductSum(9), 15);
assert.equal(minProductSum(10),16);

assert.equal(solve(2, 6), 30);

console.log("---- TESTS PASSED ----");

let sum = solve(2, 12000);

console.log(sum + " is the answer");