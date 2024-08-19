const assert = require('assert');
const { primeHelper, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 1e16;
const MAX_PRIME = 100;

primeHelper.initialize(MAX_PRIME);

function combinaison(count) {
    /*
      (count-1)! / (count-1-3)!3! = (count-1)! / 6(count-4)! = (count-1)(count-2)(count-3) / 6
    */
    return ((count - 1) * (count - 2) * (count - 3)) / 6;
}

function count(maxValue) {
    let totalCount = 0;
    const allPrimes = primeHelper.allPrimes();

    function inner(index, value, count) {
        if (value >= maxValue) {
            return;
        }

        if (count >= 4) {
            const sign = count & 1 ? -1 : 1;
            const b = combinaison(count);
            totalCount += sign * Math.floor(maxValue / value) * b;
        }

        for (let i = index; i < allPrimes.length; i++) {
            const v = value * allPrimes[i];
            if (v >= maxValue) {
                break;
            }
            inner(i + 1, v, count + 1);
        }
    }

    inner(0, 1, 0);
    return totalCount;
}

assert.strictEqual(count(1e8), 7881475);
console.log('Test passed');

const answer = TimeLogger.wrap('', () => count(MAX));
console.log(`Answer is ${answer}`);
