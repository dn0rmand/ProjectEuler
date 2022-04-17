// Ordered radicals
// -----------
// Problem 124
// ----------- 
// The radical of n, rad(n), is the product of the distinct prime factors of n. 
// For example, 504 = 2^3 × 3^2 × 7, so rad(504) = 2 × 3 × 7 = 42.

// If we calculate rad(n) for 1 ≤ n ≤ 10, then sort them on rad(n), and sorting on n if the radical values are equal, we get:

// Unsorted        Sorted

// n   rad(n)      n   rad(n)  k
// 1   1           1     1     1
// 2   2           2     2     2
// 3   3           4     2     3
// 4   2 	        8     2     4
// 5   5           3     3     5
// 6   6           9     3     6
// 7   7           5     5     7
// 8   2           6     6     8
// 9   3           7     7     9
// 10  10         10    10    10

// Let E(k) be the kth element in the sorted n column; for example, E(4) = 8 and E(6) = 9.

// If rad(n) is sorted for 1 ≤ n ≤ 100000, find E(10000).

const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

primeHelper.initialize(100000);

function rad(n) {
    if (n === 1)
        return 1;
    if (primeHelper.isPrime(n))
        return n;

    let result = 1;
    for (let p of primeHelper.primes()) {
        if (p > n)
            break;
        if (n % p === 0) {
            result *= p;
            while (n % p === 0)
                n /= p;

            if (n === 1)
                break;
            if (primeHelper.isPrime(n)) {
                result *= n;
                break;
            }
        }
    }

    return result;
}

function E(max, index) {
    let values = [];

    for (let n = 1; n <= max; n++) {
        let r = rad(n);
        values.push({
            n: n,
            rad: r
        });
    }

    values.sort((a, b) => {
        if (a.rad === b.rad)
            return a.n - b.n;
        else
            return a.rad - b.rad;
    });

    let x = values[index - 1];
    return x.n;
}

assert.equal(E(10, 4), 8);
assert.equal(E(10, 6), 9);

let answer = E(100000, 10000);

console.log('Answer is', answer);