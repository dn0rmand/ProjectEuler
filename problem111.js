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
const primeHelper = require('tools/primeHelper')();
const announce = require('tools/announce');

const MAX_SIZE = 10;

function loadPrimes()
{
    console.log('Loading prime ...');

    let START = 1E9;
    let MAX   = Math.pow(10, MAX_SIZE)-1;

    primeHelper.initialize(START, true);

    while (START < MAX)
    {
        let count = MAX-START;
        if (count > 1E9)
            count = 1E9;
        primeHelper.initialize(count);
        START += count;
    }

    console.log('Primes loaded');
}

function findIndex(primes, MIN)
{
    let min   = 0;
    let max   = primes.length-1;
    let index = Math.floor((max+min) / 2);
    let p     = primes[0];

    while (max > min)
    {
        p = primes[index];
        if (p < MIN)
        {
            min = index;
            index = Math.floor((max+min) / 2);
            if (index === min) // Same
                return index;
        }
        else if (p > MIN)
        {
            max = index;
            index = Math.floor((max+min) / 2);
            if (index === max) // Same
                break;
        }
        else
            return index;
    }
    while (p > MIN && index > 0)
    {
        index--;
        p = primes[index];
    }
    return index;
}

function *getPrimes(MIN, MAX)
{
    primeHelper.reset();
    primeHelper.initialize(Math.sqrt(MAX));

    if ((MIN & 1) === 0)
        MIN++;

    for (let p = MIN; p <= MAX; p+=2)
    {
        if (primeHelper.isPrime(p))
        {
            yield p;
        }
    }
}

function solve(size, dump)
{
    let MIN = Math.pow(10, size-1);
    let MAX = Math.pow(10, size)-1;

    let map = [
        { max:0, count:0, sum:0 }, // 0
        { max:0, count:0, sum:0 }, // 1
        { max:0, count:0, sum:0 }, // 2
        { max:0, count:0, sum:0 }, // 3
        { max:0, count:0, sum:0 }, // 4
        { max:0, count:0, sum:0 }, // 5
        { max:0, count:0, sum:0 }, // 6
        { max:0, count:0, sum:0 }, // 7
        { max:0, count:0, sum:0 }, // 8
        { max:0, count:0, sum:0 }, // 9
    ];

    // Look for first index

    for (let prime of getPrimes(MIN, MAX))
    {
        let digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let max    = 0;
        let p      = prime;

        while (p > 0)
        {
            let d = p % 10;
            p = (p - d) / 10;
            digits[d]++;
            if (digits[d] > max)
                max = digits[d];
        }

        for (let i = 0; i < 10; i++)
        {
            if (digits[i] === max)
            {
                let info = map[i];
                if (info.max === max)
                {
                    info.count++;
                    info.sum += prime;
                }
                else if (info.max < max)
                {
                    info.max = max;
                    info.count = 1;
                    info.sum = prime;
                }
            }
        }
    }

    let total = 0;

    for (let i = 0; i < 10; i++)
    {
        total += map[i].sum;
        if (dump)
            console.log(i, ': M =', map[i].max, ', N =', map[i].count, ', S =', map[i].sum);
    }
    console.log('');

    return total;
}

// loadPrimes();

assert.equal(solve(4, true), 273700);
announce(111, "Answer for 4 is 273700");

let answer = solve(MAX_SIZE, true);
announce(111, "Answer for 10 is "+answer);

console.log('Done');