const assert = require('assert');
const binomial = require('tools/binomial');
const timeLogger = require('tools/timeLogger');

function T(N, m)
{
    const holeSize  = Math.floor(N / (m-1));

    const x1 = (m-1)*holeSize + m - N - 1;
    const x2 = N - (m-1)*holeSize;

    return x1 * binomial(holeSize, 2) + x2 * binomial(holeSize+1, 2);  
}

function L(N)
{
    let total = 0;

    for(let m = 2; m <= N; m++) {
        total += T(N, m);
    }

    return total;
}

assert.strictEqual(T(8, 4), 7);
assert.strictEqual(T(3, 2), 3);

assert.strictEqual(L(1E3), 3281346);
console.log('Test passed');

const answer = timeLogger.wrap('', _ => L(1E7));
console.log(`Answer is ${answer}`);