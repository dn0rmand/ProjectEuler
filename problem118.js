// Pandigital prime sets
// ---------------------
// Problem 118
// -----------
// Using all of the digits 1 through 9 and concatenating them freely to form decimal integers,
// different sets can be formed. Interestingly with the set {2,5,47,89,631}, all of the elements
// belonging to it are prime.

// How many distinct sets containing each of the digits one through nine exactly once contain only prime elements?

const primeHelper = require('tools/primeHelper')();

console.log('Loading primes ...');
// primeHelper.initialize(987654322, true);
primeHelper.initialize(1E5, true);
console.log('Primes loaded.');
let primes = primeHelper.allPrimes();

function solve()
{
    let usedDigits = [];
    let digitCount = 0;
    let total = 0;

    function isAllowed(prime)
    {
        while (prime > 0)
        {
            let d = prime % 10;
            if (d === 0) // digit 0 not allowed
                return false;

            if (digitCount === 9 || usedDigits[d])
                return false;

            digitCount++;
            usedDigits[d] = 1;
            prime = (prime - d) / 10;
        }
        return true;
    }

    let set = [];
    function inner(index, max)
    {
        if (digitCount === 9)
        {
            // process.stdout.write('\r' + total + ' : ' + set.toString() + "       ");
            total++;
            return;
        }

        let oldCount = digitCount;
        let oldDigits= Array.from(usedDigits);

        for (let i = index ; i < primes.length; i++)
        {
            let p = primes[i];
            if (p >= max)
                break;

            if (isAllowed(p))
            {
                // set.push(p);
                inner(i+1, max / 10);
                // set.pop();
            }

            usedDigits = Array.from(oldDigits);
            digitCount = oldCount;
        }
    }

    inner(0, 1E9);

    return total;
}

let answer = solve();
console.log("\n");
console.log("Answer", answer);
console.log('Done');