// Primes with runs
// ----------------
// Problem 111
// -----------
// Considering 4-digit primes containing repeated digits it is clear that they cannot all be the same:
// 1111 is divisible by 11,
// 2222 is divisible by 22, and so on.
// But there are nine 4-digit primes containing three ones:

// 1117, 1151, 1171, 1181, 1511, 1811, 2111, 4111, 8111

// We shall say that M(n, d) represents the maximum number of repeated digits for an n-digit prime where d
// is the repeated digit, N(n, d) represents the number of such primes, and S(n, d) represents the sum of these primes.

// So M(4, 1) = 3 is the maximum number of repeated digits for a 4-digit prime where one is the repeated digit,
// there are N(4, 1) = 9 such primes, and the sum of these primes is S(4, 1) = 22275. It turns out that for d = 0,
// it is only possible to have M(4, 0) = 2 repeated digits, but there are N(4, 0) = 13 such cases.

// In the same way we obtain the following results for 4-digit primes.

//         Digit, d   M(4, d)  N(4, d)  S(4, d)
//             0          2	     13	     67061
//             1          3	      9	     22275
//             2          3	      1	      2221
//             3          3	     12	     46214
//             4          3	      2	      8888
//             5          3	      1	      5557
//             6          3	      1	      6661
//             7          3	      9	     57863
//             8          3	      1	      8887
//             9          3	      7	     48073

// For d = 0 to 9, the sum of all S(4, d) is 273700.

// Find the sum of all S(10, d).

const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const MAX_SIZE = 10;

primeHelper.initialize(Math.sqrt(Math.pow(10, MAX_SIZE)));

function solve(size)
{
    function *getPrimes(digit, length)
    {
        let digits = [];
        for (let i = 0; i < size; i++)
            digits[i] = digit;

        function value()
        {
            let v = 0;
            for (let i = 0; i < size; i++)
            {
                v = (v*10) + digits[i];
            }

            return v;
        }

        function *inner(index, len)
        {
            if (len === 10)
            {
                if (digits[0] === 0)
                    return;

                let v = digits[size-1];
                if ((v & 1) === 0 || v === 5)
                    return; // Not prime

                v = value();
                if (primeHelper.isPrime(v))
                    yield v;

                return;
            }

            for (let i = index; i < size; i++)
            {
                let old = digits[i];

                for (let d = 0; d < 10; d++)
                {
                    if (d === digit)
                        continue;

                    if (i === 0 && d === 0)
                        continue;
                    if (i === 9 && (d & 1) === 0)
                        continue;

                    digits[i] = d;
                    yield *inner(i+1, len+1);
                }

                digits[i] = old;
            }
        }

        yield *inner(0, length);
    }

    let total = 0;

    for (let d = 0; d < 10; d++)
    {
        for (let l = 10; l > 1; l--)
        {
            let sum   = 0;
            for (let p of getPrimes(d, l))
            {
                sum += p;
            }

            if (sum > 0)
            {
                total += sum;
                break;
            }
        }
    }

    return total;
}

function problem111()
{
    assert.equal(solve(4, true), 273700);

    let answer = solve(MAX_SIZE, true);
    console.log("Answer for 10 is "+answer);
}

console.time(111);
problem111();
console.timeEnd(111);