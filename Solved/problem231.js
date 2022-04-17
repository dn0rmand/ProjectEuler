// The prime factorisation of binomial coefficients
// ------------------------------------------------
// Problem 231
// -----------
// The binomial coefficient 10C3 = 120.
// 120 = 2^3 × 3 × 5 = 2 × 2 × 2 × 3 × 5, and 2 + 2 + 2 + 3 + 5 = 14.
// So the sum of the terms in the prime factorisation of 10C3 is 14.

// Find the sum of the terms in the prime factorisation of 20000000C15000000.

const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const N = 20000000;
const K = 15000000;

primeHelper.initialize(N);

function solve()
{
    let total = 0;
    let NK = N-K;

    for (let i = 2; i <= NK; i++)
    {
        primeHelper.factorize(i, (prime, factor) =>
        {
            total -= (prime * factor);
        });
    }

    for (let i = K+1; i <= N; i++)
    {
        primeHelper.factorize(i, (prime, factor) =>
        {
            total += (prime * factor);
        });
    }

    return total;
}

console.time(231);
let answer = solve();
console.timeEnd(231);
console.log('Answer is', answer,' - right answer is 7526965179680');
