const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 60;

const $A = [1n, 1n];

// A120588: a(n) = Sum_{k=1..n-1} a(k) * a(n-k)

function A(n) {
    if ($A[n] !== undefined) {
        return $A[n];
    }
    let total = 0n;
    for (let k = 1; k < n; k++) {
        total += A(k) * A(n - k);
    }
    $A[n] = total;
    return total;
}

function getCount(length) {
    if (length === 1) {
        return 1n;
    }
    if (length % 2 !== 0) {
        return 0n;
    }
    return A(length / 2);
}

function solve(length) {
    let total = 0n;

    for (let leftLength = 1; leftLength < length; leftLength++) {
        const leftCount = getCount(leftLength);
        if (leftCount === 0n) {
            continue;
        }
        for (let rightLength = 1; rightLength + leftLength <= length; rightLength++) {
            const rightCount = getCount(rightLength);
            if (rightCount === 0n) {
                continue;
            }

            const power = BigInt(length - leftLength - rightLength);
            total += rightCount * leftCount * 2n ** power;
        }
    }

    return total;
}

assert.strictEqual(solve(8), 181n);
assert.strictEqual(solve(3), 4n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX));
console.log(`Answer is ${answer}`);
