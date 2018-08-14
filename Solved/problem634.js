// Numbers of the form a^2*b^3
// ---------------------------
// Problem 634 
// -----------
// Define F(n) to be the number of integers x≤n that can be written in the form x=a^2b^3, where a and b
// are integers not necessarily different and both greater than 1.

// For example, 32=2^2×2^3 and 72=3^2×2^3 are the only two integers less than 100 that can be written in this form. 
// Hence, F(100)=2
// Further you are given F(2×10^4)=130 and F(3×10^6)=2014
// Find F(9×10^18)

const primeHelper = require('tools/primeHelper')();
const assert = require('assert');
const announce = require('tools/announce');

const MAX = 9E18;
const MAX_PRIME = Math.floor(Math.sqrt(MAX/8));

function log(name, action)
{
    console.log(name, '...');
    action();
    console.log("Done with", name);
    console.log("");
}

log("Preloading primes", () => {
    primeHelper.initialize(MAX_PRIME, true);
});

const allFactors = {};

function analyze(factor)
{
    switch (factor)
    {
        case 2:
        case 4: 
            return { square:true };
        case 3:
            return { cube:true };
        case 5:
            return { both:true };
        case 6:
            return { square:true, cube:true };
        default:
            return { both:true};
    }
    /*
    let value   = Math.pow(2, factor);
    let cube    = false;
    let square  = false;

    for (let a = 2; ; a++)
    {
        let a2 = a*a;
        let a3 = a*a2;

        if (a2 === value)
            square = true;
        if (a3 === value)
            cube = true;
        if (a2 * a3 === value)
            return { both: true };            

        if (a2 > value)
            break;
            
        if (a2*a3 > value)
            continue;

        for (let b = a+1; ; b++)
        {
            let b2 = b*b;
            let b3 = b*b2;

            let v1 = a2 * b3;
            let v2 = a3 * b2;

            if (v1 === value)
            {
                // console.log(value, ' => ', a , '^2 * ', b, '^3');
                return { both:true };
            }
            if (v2 === value)
            {
                // console.log(value, ' => ', a , '^3 * ', b, '^2');
                both = true;
                return { both:true };
            }
            if (v1 > value && v2 > value)
                break;
        }
    }
    return { square: square, cube: cube };
    */
}

function F(max)
{
    const allPrimes  = primeHelper.allPrimes();

    let total = 0;
    let factors = [];

    function isValid()
    {
        let cube   = false;
        let square = false;
        let either = 0;

        for (let f of factors)
        {
            let info = allFactors[f];
            if (info === undefined)
            {
                info = analyze(f);
                allFactors[f] = info;
            }
            if (info.both)
            {
                square = true;
                cube   = true;
            }
            else if (info.cube && info.square)
                either++;
            else if (info.cube)
                cube = true;
            else if (info.square)
                square = true;
            else
                return false;
        }

        if (either > 1)
            return true;

        if (either === 1)
            result = cube || square;
        else
            result = cube && square;

        return result;
    }

    function inner(value, index)
    {
        if (value > max)
            return;

        if (isValid())
            total++;

        for (let idx = index; idx < allPrimes.length; idx++)
        {
            let p = allPrimes[idx];
            let p2 = p*p;

            let v = value * p2;
            if (v > max)
                break;

            let i = factors.length;
            let f = 2;

            factors.push(2);

            while (v <= max)
            {
                inner(v, idx+1);
                v *= p;
                factors[i]++;
            }
            factors.pop();
        }
    }

    inner(1, 0);

    return total;
}

log("Testing", () => {
    assert.equal(F(100), 2);
    assert.equal(F(2E4), 130);
    assert.equal(F(3E6), 2014);
});

log("Solving", () => { 
    let answer = F(MAX); 
    announce(634, 'Answer is ' + answer );
});

