const assert = require('assert');
const primeHelper = require('tools/primeHelper')();

const MAX = 1E36;

const MAX_PRIME = 1E7;
const SIX = 6;
const TWO = 2;
const ONE = 1;
const ZERO = 0;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes();

class FactorArray
{
    constructor()
    {
        this.$factors = [];
        this.$length  = 0;
    }

    length()
    {
        return this.$length;
    }

    setLength(value)
    {
        if (value < 0)
            value = 0;
        if (value < this.$length)
            this.$length = value;
    }

    push(value)
    {
        this.$factors[this.$length] = value;
        this.$length++;
    }

    pop()
    {
        if (this.$length > 0)
            this.$length--;
    }

    get(index)
    {
        if (index >= 0 && index < this.$length)
            return this.$factors[index];
    }
}

function solve(size)
{
    let total     = 1;
    let factors   = new FactorArray();
    let processed = new Set();

    let maxPower = (function()
    {
        let max = 1;

        for(let p of allPrimes)
        {
            if ((TWO ** (p-1)) > size)
                break;
            max = p;
        }

        return max;
    })();

    function pass1()
    {
        for (let prime of allPrimes)
        {
            let p      = prime;
            let factor = p ** SIX;

            p = factor;

            if (p > size)
                break;

            while (p < size)
            {
                total++;
                processed.add(p);
                p *= factor;
            }
        }
    }

    function pass3(powers)
    {
        const usedPrimes = [];

        function inner(value, index)
        {
            if (value >= size)
                return;
            if (index >= powers.length())
            {
                if (! processed.has(value))
                {
                    total++;
                    processed.add(value);
                }
                return;
            }

            let power = powers.get(index);
            for (let p of allPrimes)
            {
                if (usedPrimes.includes(p))
                    continue;

                let f = value * (p ** power);

                if (f >= size)
                    break;

                usedPrimes.push(p);
                inner(f, index+1);
                usedPrimes.pop();
            }
        }

        inner(ONE, 0);
    }

    function pass2()
    {
        // function moreFactors(index, value)
        // {
        //     for (let i = index; i < factors.length; i++)
        //     {
        //         let factor = ((value+1) * (factors[i]+1));
        //         if (factor <= maxPower)
        //         {
        //             factor--;
        //             if (! factors.includes(factor))
        //                 factors.push(factor);
        //             moreFactors(i+1, factor);
        //         }

        //         moreFactors(i+1, value);
        //     }
        // }

        function inner(value, index)
        {
            if (factors.length() > 1 && value % SIX === ONE)
            {
                // let c = factors.length;
                // moreFactors(0, 0);
                // if (factors.length !== c)
                // {
                //     factors.length = c;
                // }
                pass3(factors);
            }

            let c = factors.length();

            for (let i = index; i < allPrimes.length; i++)
            {
                let prime = allPrimes[i];
                if (prime > maxPower)
                    break;

                let v = value * prime;

                while (v <= size && ((v % SIX) !== ZERO))
                {
                    factors.push(prime-1);
                    inner(v, i+1);
                    v *= prime;
                }

                factors.setLength(c);
            }
        }

        inner(ONE, 2);
    }

    pass1();
    pass2();

    // let x = [ONE, ...processed.keys()].sort((a,b) => { return a-b; });
    // console.log(...x);
    return total;
}

function $solve(size)
{
    let dice  = new Uint8Array(size);

    dice.fill(1);

    function dump()
    {
        let values = [];
        for (let i = 0; i < size; i++)
        {
            if (dice[i] === 1)
                values.push(i+1);
        }
        console.log(...values);
        // console.log(dice.join(','));
    }

    let count = size;
    for (let i = 2; i < size; i++)
    {
        let x = i-1;
        while (x < size)
        {
            let v1 = dice[x];
            let v2 = (v1 % 6) + 1;
            dice[x] = v2;
            x += i;

            if (v1 === 1)
                count--;
            else if (v2 === 1)
                count++;
        }
    }

    dump();

    return count;
}

// console.log(solve(MAX));

console.log(" 1E9 =", solve(1E9));
console.log("1E10 =", solve(1E10));

assert.equal(solve(100), 2);
assert.equal(solve(1E7), 36);
assert.equal(solve(1E8), 69);
assert.equal(solve(1E12), 740);

console.log('done')