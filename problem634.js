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

const MAX = 9E12;
const MAX_PRIME = Math.floor(Math.sqrt(MAX));

primeHelper.initialize(MAX_PRIME);

function makeCubes()
{
    let cubes = {};
    for (let i = 2; i < 10; i++)
        cubes[i*i*i] = i;

    return cubes;
}

function makeSquares()
{
    let squares = {};
    for (let i = 2; i < 10; i++)
        squares[i*i] = i;

    return squares;
}

const primes  = primeHelper.allPrimes();
const squares = makeSquares();
const cubes   = makeCubes();

function F(max)
{
    let total = 0;
    let factors = [];

    function $isValid(value)
    {
        for (let a = 2; ; a++)
        {
            let a2 = a*a;
            let a3 = a*a2;
    
            if (a2*a3 > value)
                break;
            
            if (a2 * a3 === value)
            {
                console.log(value, ' => ', a , '^5');
                return true;
            }

            for (let b = a+1; ; b++)
            {
                let b2 = b*b;
                let b3 = b*b2;
    
                let v1 = a2 * b3;
                let v2 = a3 * b2;
    
                if (v1 === value)
                {
                    console.log(value, ' => ', a , '^2 * ', b, '^3');
                    return true;
                }
                if (v2 === value)
                {
                    console.log(value, ' => ', a , '^3 * ', b, '^2');
                    return true;
                }
                if (v1 > value && v2 > value)
                    break;
            }
        }
        return false;
    }

    function isValid(value)
    {       
        let square = false;
        let cube   = false;
        let either = false;
        let bad    = false;

        function checkFactor(f)
        {
            // if (cubes[f] !== undefined)
            // {
            //     cube = true;
            //     checkFactor(cubes[f]);
            //     return;
            // }
            // if (squares[f] !== undefined)
            // {
            //     square = true;
            //     checkFactor(squares[f]);
            //     return;
            // }

            if (f % 2 === 0 && f % 3 === 0)
            {
                either = true;
            }
            else if (f % 5 === 0)
            {
                cube = square = true;
            }
            else if (f % 3 === 0)
            {
                cube = true;
                if (f !== 3 && ! square)
                {   
                    let x = f;
                    while (x % 3 === 0)
                    {
                        if (squares[x] !== undefined)
                        {
                            square = true;
                            break;
                        }
                        x /= 3;
                    }
                    if (! square)
                        checkFactor(f / 3);
                }
            }
            else if (f % 2 === 0)
            {
                square = true;
                if (f !== 2 && ! cube)
                {                    
                    let x = f;
                    while (x % 2 === 0)
                    {
                        if (cubes[x] !== undefined)
                        {
                            cube = true;
                            break;
                        }
                        x /= 2;
                    }
                    if (! cube)
                        checkFactor(f / 2);
                }
            }
            else   
            {              
                let c = { c:cube, s:square, e:either };
                
                if (f > 3)
                {
                    square = false;
                    cube   = false;
                    either = false;

                    checkFactor(f - 3);

                    if (!bad && (either || square))
                    {
                        cube    = true;
                        square |= c.square;
                        either |= c.either;
                        return;
                    }

                    square = false;
                    cube   = false;
                    either = false;
                    bad    = false;

                    checkFactor(f - 2);

                    if (!bad && (either || cube))
                    {
                        square  = true;
                        cube   |= c.cube;
                        either |= c.either;
                        return;
                    }

                    square = c.square;
                    cube   = c.cube;
                    either = c.either;
                    bad    = true;
                }
            }
        }

        for (let f of factors)
        {            
            checkFactor(f);
            if (bad)
            {
                if ($isValid(value))
                    return true;
                return false;
            }
        }

        if (square && cube)
            return true;
        if (either)
            return square || cube;

        if ($isValid(value))
            return true;
        return false;
    }

    function inner(value, index)
    {
        if (value > max)
            return;

        if (isValid(value))
        {
            total++;
        }

        for (let idx = index; idx < primes.length; idx++)
        {
            let p = primes[idx];
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

    // factors.push(16);
    // isValid(Math.pow(2, 16));
    // factor.pop();

    inner(1, 0);

    return total;
}

//assert.equal(F(100), 2);
// assert.equal(F(2E4), 130);
assert.equal(F(3E6), 2014);

// let answer = F(9E18);

console.log('Done');