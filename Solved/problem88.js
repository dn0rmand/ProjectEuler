const assert = require('assert');

const MADMAX = 12000;

function solve(MAX)
{
    const maxProd    = 2 * MAX;
    const maxFactors = Math.floor(Math.log10(maxProd) / Math.log10(2));
    const sums       = new Array(MAX+1);
    const factors    = [];

    function productMatchSum()
    {        
        let p = 1;
        let s = 0;
    
        for (let v of factors)
        {
            p *= v;
            s += v;
        }
    
        return {p: p, s: s };
    }
        
    function setSum(index, sum)
    {
        if (index > MAX)
            return;
        if (sums[index] === undefined)
            sums[index] = sum;
        else if (sums[index] > sum)
            sums[index] = sum;
    }

    function addFactor()
    {
        factors.push(2);
        for (i = 0; i < factors.length; i++)
            factors[i] = 2;
    }

    function next()
    {
        let index = factors.length-1;
        while (true)
        {
            let v = factors[index];
            if (v < MAX)
            {
                factors[index] = v+1;
                return true;
            }
            else if (index > 0)
            {
                index--;
                let v = factors[index];
                if (v < MAX)
                {
                    factors[index] = v+1;

                    for(let i = index+1; i < factors.length; i++)
                    {
                        factors[i] = 2;
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

    factors.push(2, 2);

    // for(let i = 2; i <= MAX; i++)
    //     sums[i] = 2*i;

    while(factors.length <= maxFactors)
    {
        let result = productMatchSum(factors);

        if (result.p === result.s)
        {
            setSum(factors.length, result.s);
            if (! next())
                addFactor();
        }
        else if (result.p <= maxProd)
        {
            let diff = result.p - result.s;
            let size = factors.length + diff;
            setSum(size, result.p);
            if (! next())
                addFactor();
        }
        else
        {
            // addFactor();
            let p = 1;
            for (let i = 0; i < factors.length; i++)
            {
                if (p <= maxProd)
                    p *= factors[i];
                if (p > maxProd)
                {
                    factors[i] = MAX;
                } 
            }
            if (! next())
                addFactor();
        }
    }

    sums[0] = 0;
    sums[1] = 0;
              
    assert.equal(sums[2], 4);
    assert.equal(sums[3], 6);
    assert.equal(sums[4], 8);
    assert.equal(sums[5], 8);
    assert.equal(sums[6], 12);
    // assert.equal(sums[7], 12);
    // assert.equal(sums[8], 12);
    // assert.equal(sums[9], 15);
    // assert.equal(sums[10],16);

    sums.sort((a, b) => 
    {
        if (a === undefined || b === undefined)
            throw "Missing values";
        return a-b; 
    });

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

assert.equal(solve(6), 30);
console.log("---- TEST PASSED ----");

let sum = solve(MADMAX);
console.log(sum + " is the sum of all the minimal product-sum numbers for 2≤k≤12000");
