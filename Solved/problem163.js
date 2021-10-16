const assert = require('assert');

// https://oeis.org/A210687
function T(n)
{
    const n2 = n*n;
    const n3 = n2*n;

    let answer = 0;
    
    answer += 1678 * n3;
    answer += 3117 * n2;
    answer += 88 * n;
    answer -= 345 * (n % 2);
    answer -= 320 * (n % 3);
    answer -= 90 * (n % 4);
    answer -= 288 * ((n3 - n2 + n) % 5);

    answer /= 240;

    return answer;
}

assert.strictEqual(T(1), 16);
assert.strictEqual(T(2), 104);
console.log('Tests passed');

const answer = T(36);
console.log(`Answer is ${answer}`);