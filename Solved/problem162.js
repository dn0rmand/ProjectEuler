const assert = require('assert');

function solve(maxLength)
{
    let total    = BigInt(0);
    let SIXTEEN  = BigInt(16);

    function count(a, one, zero)
    {
        let minLength = Math.max(a, one, zero)+1;

        let nums = BigInt(1);
        for (let i = 0; i < minLength; i++)
        {
            let count = SIXTEEN;

            if (i === a || i === one || i === zero)
                continue;
            if (i === 0 || i < zero)
                count--; // cannot be ZERO
            if (i < a) // cannot be A
                count--;
            if (i < one) // cannot be 1
                count--;

            nums *= count;
        }

        total += nums;

        for (let l = minLength; l < maxLength; l++)
        {
            nums  *= SIXTEEN;
            total += nums;
        }
    }

    function moveZero(a, one)
    {
        for (let zero = 1; zero < maxLength; zero++)
        {
            if (zero === a || zero === one)
                continue;

            count(a, one, zero);
        }
    }

    function moveOne(a)
    {
        for (let one = 0; one < maxLength; one++)
        {
            if (one === a)
                continue;

            moveZero(a, one);
        }
    }

    function moveA()
    {
        for (let a = 0; a < maxLength; a++)
            moveOne(a);
    }

    moveA();

    return total;
}

assert.equal(solve(3), 4);

let answer = solve(16);
answer = answer.toString(16).toUpperCase();
console.log('Answer is', answer);