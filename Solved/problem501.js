// Eight Divisors
// Problem 501 
// The eight divisors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24. 
// The ten numbers not exceeding 100 having exactly eight divisors are 
// 24, 30, 40, 42, 54, 56, 66, 70, 78 and 88. 
// Let f(n) be the count of numbers not exceeding n with exactly eight divisors.
// You are given f(100) = 10, f(1000) = 180 and f(10^6) = 224427.
// Find f(10^12).

const assert      = require('assert');
const primeHelper = require('tools/primeHelper')();

const MAX         = 1E12;
const MAX_PRIME   = Math.ceil(Math.sqrt(MAX));

primeHelper.initialize(MAX_PRIME, true);
primeHelper.countPrimes(MAX);

function f(max)
{
    let total  = 0;

    function count1()
    {
        let total = 0;

        for (let p of primeHelper.allPrimes())
        {
            let v = Math.pow(p, 7);
            if (v > max)
                break;
            total++;
        }

        return total;
    }

    function count2()
    {
        let total = 0;

        for (let p1 of primeHelper.allPrimes())
        {
            let v1 = p1*p1*p1;
            if (v1 > max)
                break;
            
            let maxP = Math.floor(max / v1);
            if (maxP <= 1)
                break;

            let count = primeHelper.countPrimes(maxP);
            if (maxP >= p1)
                count--;
            total += count;
        }

        return total;
    }

    function count3()
    {
        let total = 0;
        let primes = primeHelper.allPrimes();

        for (let i = 0; i < primes.length; i++)
        {
            let pi = primes[i];

            if (pi*pi*pi > max)
                break;

            for (let j = i+1; j < primes.length; j++)
            {
                let pj = primes[j];
                let v = pi*pj;
                
                if (v*pj > max)
                    break;

                let target = Math.floor(max / v);
                let count = primeHelper.countPrimes(target) - primeHelper.countPrimes(pj);
                total += count;
            }
        }
        return total;
    }

    let c1 = count1(); // 15
    let c2 = count2(); // 7297845280
    let c3 = count3(); // 190614467420

    total = c1+c2+c3;

    return total;
}

assert.equal(f(1E6), 224427);
assert.equal(f(1000), 180);
assert.equal(f(100), 10);

let answer = f(MAX, true);
console.log("Answer", answer,' - Should be 197912312715');
console.log('Done');