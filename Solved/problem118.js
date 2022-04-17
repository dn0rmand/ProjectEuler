// Pandigital prime sets
// ---------------------
// Problem 118
// -----------
// Using all of the digits 1 through 9 and concatenating them freely to form decimal integers,
// different sets can be formed. Interestingly with the set {2,5,47,89,631}, all of the elements
// belonging to it are prime.

// How many distinct sets containing each of the digits one through nine exactly once contain only prime elements?

const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const MAX = 987654321;

console.log('Loading primes ...');
primeHelper.initialize(MAX+1, true);
// primeHelper.initialize(1E4, true);
console.log('Primes loaded.');
let primes = primeHelper.allPrimes();

function solve()
{
    let usedDigits = [];
    let digitCount = 0;
    let total = 0;

    function isAllowed(prime, digits)
    {
        let di = [];
        let count = digitCount;
        while (prime > 0)
        {
            let d = prime % 10;
            if (d === 0) // digit 0 not allowed
                return false;

            if (count === 9 || usedDigits[d] || di[d])
                return false;

            count++;
            digits.push(d);
            di[d] = 1;
            prime = (prime - d) / 10;
        }
        return true;
    }

    let set = [];
    function inner(index)
    {
        if (digitCount === 9)
        {
            process.stdout.write('\r' + total + ': ' + set.toString() + '  ');
            total++;
            return;
        }

        let max = Math.pow(10, 9-digitCount);
        for (let i = index ; i < primes.length; i++)
        {
            let p = primes[i];
            if (p >= max)
                break;

            let digits = [];

            if (isAllowed(p, digits))
            {
                // Apply
                for (let d of digits)
                    usedDigits[d] = 1;
                digitCount += digits.length;
                // Keep going
                set.push(p);
                inner(i+1);
                set.pop();
                // Restore
                digitCount -= digits.length;
                for (let d of digits)
                    usedDigits[d] = 0;
            }
        }
    }

    inner(0);

    return total;
}

let answer = solve();
console.log('');
console.log("Answer", answer);
console.log('Done');