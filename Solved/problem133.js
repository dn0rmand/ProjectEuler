const primeHelper = require('tools/primeHelper')();
const assert = require('assert');

require('tools/bigintHelper');

const MAX = 100000;
primeHelper.initialize(MAX+1);

function solve()
{
    let total = 0;
    let TEN = 10n;

    for (let prime of primeHelper.primes())
    {
        if (prime >= MAX)
            break;
        if (prime === 3) // Exceptions
        {
            total += 3;
            continue;
        }

        let p9 = BigInt(prime) * 9n;
        total += prime;

        for (let digits = 1, value = 10n; digits < 20 ; value *= 10n, digits++)
        {
            let m = TEN.modPow(value, p9);
            if (m === 1n)
            {
                total -= prime;
                break;
            }
        }
    }

    return total;
}

let answer = solve();
console.log('Answer is', answer , 'good answer is 453647705');