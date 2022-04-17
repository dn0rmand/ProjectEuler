const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

// http://oeis.org/A027459

function solve(n)
{
    let hk = 0;
    let total = 0;

    for(let k = 1; k <= n; k++)
    {
        hk += n/k;

        total += hk / k;
    }

    return total;
}

assert.equal(solve(2), 7 / 2);
assert.equal(solve(5).toFixed(6), (12019 / 720).toFixed(6));
assert.equal(solve(100).toFixed(7), 1427.1934705);

const answer = timeLogger.wrap('', _ => solve(1E8));

console.log(`Answer is ${Math.round(answer)}`);
