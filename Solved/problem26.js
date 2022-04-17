const assert = require('assert');

const {
    TimeLogger: timeLogger,
} = require('@dn0rmand/project-euler-tools');

const TEN = 10;

function getLength(n) {
    const reference = TEN.modPow(n, n);

    let len = 0;
    let rest = reference;
    do {
        rest = (rest * 10) % n;
        len++;
    }
    while (rest != reference);
    return len;
}

function solve(MAX) {
    let length = 0;
    let value = 0;

    for (let n = 2; n <= MAX; n++) {
        const len = getLength(n);

        if (len > length) {
            value = n;
            length = len;
        }
    }

    return {
        value,
        length
    };
}

const {
    value,
    length
} = timeLogger.wrap('Solving', _ => solve(1000, true));

console.log("Value of d < 1000 for which 1/d contains the longest recurring cycle in its decimal fraction part is");
console.log(`${value} with a cycle of ${length} digits`);