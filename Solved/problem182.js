const assert = require('assert');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

// https://math.stackexchange.com/questions/1298664/rsa-fixed-point

function solve(P, Q)
{
    const N = P*Q;
    const φ = (P-1)*(Q-1);

    let min = N+1;
    let sum = 0;

    for(let e = 1; e < φ; e++) 
    {
        // must be coprime
        if (! e.isCoPrime(φ))
            continue;

        const badP = (e-1).gcd(P - 1) + 1;
        const badQ = (e-1).gcd(Q - 1) + 1;
        const count = badP * badQ;

        if (min === count) {
            sum += e;
        } else if (count < min) {
            min = count;
            sum = e;
        }     
    }

    return sum;
}

assert.strictEqual(solve(19, 37), 17766);
assert.strictEqual(solve(83, 181), 5201406);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(1009, 3643));
console.log(`Answer is ${answer}`);
