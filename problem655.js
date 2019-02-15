// Divisible Palindromes
// ---------------------
// Problem 655
// -----------
// The numbers 545, 5995 and 15151 are the three smallest palindromes divisible by 109.
// There are nine palindromes less than 100000 which are divisible by 109.

// How many palindromes less than 10^32 are divisible by 10000019 ?

const assert = require('assert');

function *generateOdd(start, len, power)
{
    try
    {
        if (len < 0)
        {
            yield start;
            return;
        }

        let steps = 10n**power + 1n;
        if (steps == 2) // fix error
            steps = 1n;

        steps *= 10n**len;

        if (steps > start)
            return;

        for (let v = 0; v <= 9; v++)
        {
            yield *generateOdd(start, len-1n, power+2n);

            if (start % 10n == 9 && steps % 10n == 1)
                break;
            start += steps;
        }
    }
    finally
    {

    }
}

function *generatePalindromes(minSize, maxSize)
{
    function *inner2(left, right)
    {
        let l = 2*left.length;

        if (l >= minSize && l <= maxSize)
            yield BigInt(left+right);

        if (l + 1 <= maxSize && l + 1 >= minSize)
        {
            for (let middle = 0; middle <= 9; middle++)
                yield BigInt(left+middle+right);
        }
    }

    function *inner(left, right)
    {
        if (left.length + right.length > maxSize)
            return;

        yield *inner2(left, right);

        if (left.length + right.length + 2 <= maxSize)
        {
            for (let c = 0; c <= 9; c++)
            {
                yield *inner(left+c, c+right);
            }
        }
    }

    for (let c of "123456789")
        yield *inner(c, c);
}

function $solve(divisor, maxSize)
{
    let minSize = divisor.toString().length;
    let maxValue = 10n**BigInt(maxSize);

    let total = 0;

    divisor = BigInt(divisor);

    for (let palindrome of generatePalindromes(minSize, maxSize))
    {
        if ((palindrome % divisor) == 0)
        {
            total++;
        }
    }

    return total;
}

function solve(divisor, maxSize)
{
    divisor = BigInt(divisor);

    let total   = 0n;
    let minSize = divisor.toString().length;

    if ((minSize & 1) == 0) // dont care for first even ( at least with given input)
        minSize += 1;

    // ODD length
    for (let l = minSize; l <= maxSize; l += 2)
    {
        let subTotal = 0n;
        let po = BigInt(l-1);
        let start = 10n**po + 1n;

        let power = BigInt(Math.floor(l / 2));

        let d = 10n ** power;
        for (let p of generateOdd(start, power, 0n))
        {
            if (p % divisor == 0)
            {
                console.log(p);
                subTotal += 1n;
            }

            if (l+1 <= maxSize)
            {
                // calculate the odd length palindrome
                let p1 = p % d;
                let p2 = (p / d);
                let digit = p2 % 10n;

                p2 = p2*10n + digit;
                p2 = (p2*d) + p1;

                if (p2 % divisor == 0)
                {
                    subTotal += 1n;
                    console.log(p2);
                }
            }
        }

        total += subTotal;
        //console.log(l, '->', subTotal, '-', total);
    }
    return total;
}

// console.log($solve(109, 10));
// console.log(solve(109, 10));

console.log('Test');
assert.equal(solve(109, 5), 9);

console.log('Solving now');
answer = solve(10000019, 32);

console.log('Answer is', answer)