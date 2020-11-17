const assert = require('assert');

require('tools/bigintHelper');

// sum( (10^(1e16-1-3^i))%(3^i)) / 3^i )
function solve(precision)
{
    precision = BigInt(precision);

    const TEN = 10n;

    let total = 0;

    for(let i = 1n; ; i++)
    {
        const $3i = 3n**i;
        const p = precision - 1n - $3i;

        if (p <= 0n)
            break;
            
        const top = TEN.modPow(p, $3i);
        const value = top.divise($3i, 15);

        total += value;
    }

    const result = (total - Math.floor(total)).toString();

    return result.substr(2, 10);
}

assert.strictEqual(solve(100), "4938271604");
assert.strictEqual(solve(1E8), "2584642393");

console.log('Test passed');

const answer = solve(1E16);
console.log(`Answer is ${answer}`);