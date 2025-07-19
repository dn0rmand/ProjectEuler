// Divisibility streaks
// --------------------
// Problem 601
// -----------
// For every positive number n we define the function streak(n)=k as the smallest positive integer k such that
// n+k is not divisible by k+1.

// E.g:
//     13 is divisible by 1
//     14 is divisible by 2
//     15 is divisible by 3
//     16 is divisible by 4
//     17 is NOT divisible by 5
// So streak(13)=4.

// Similarly:
//     120 is divisible by 1
//     121 is NOT divisible by 2
// So streak(120)=1.

// Define P(s,N) to be the number of integers n, 1<n<N, for which streak(n)=s

// So P(3,14)=1 and P(6,10^6)=14286.

// Find the sum, as i ranges from 1 to 31, of P(i,4^i).

const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function P(s, N) {
    let lcm1 = 1n;
    let lcm2 = 1n;

    for (let i = 1n; i <= s + 1n; i++) {
        lcm1 = lcm2;
        lcm2 = lcm2.lcm(i);
    }

    let n = N - 2n;
    let v1 = n / lcm1;
    let v2 = n / lcm2;
    let v = v1 - v2;

    return v;
}

function solve(max) {
    let total = 0n;
    for (let i = 1n; i < max; i++) {
        let N = 4n ** i;
        total += P(i, N);
    }

    return total;
}

assert.equal(P(6n, 1000000n), 14286n);

let answer = TimeLogger.wrap('', () => solve(32));
console.log(`The sum, as i ranges from 1 to 31, of P(i,4^i) is ${answer}`);
