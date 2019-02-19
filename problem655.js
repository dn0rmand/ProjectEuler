// Divisible Palindromes
// ---------------------
// Problem 655
// -----------
// The numbers 545, 5995 and 15151 are the three smallest palindromes divisible by 109.
// There are nine palindromes less than 100000 which are divisible by 109.

// How many palindromes less than 10^32 are divisible by 10000019 ?

collect = global.gc || function() {}

function assert(value, expected)
{
    if (value != expected)
    {
        console.log("Error: expecting " + expected + " but got " + value);
        process.exit(-1);
    }
}

function brute(divisor, digits)
{
    function *generateOdd(start, len, power)
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

    divisor = BigInt(divisor);

    let total   = 0n;
    let minSize = divisor.toString().length;

    if ((minSize & 1) == 0) // dont care for first even ( at least with given input)
        minSize += 1;

    // ODD length
    for (let l = minSize; l <= digits; l += 2)
    {
        let subTotal = 0n;
        let po = BigInt(l-1);
        let start = 10n**po + 1n;

        let power = BigInt(Math.floor(l / 2));

        let d = 10n ** power;
        for (let p of generateOdd(start, power, 0n))
        {
            if (p % divisor == 0)
                subTotal += 1n;

            if (l+1 <= digits)
            {
                // calculate the odd length palindrome
                let p1 = p % d;
                let p2 = (p / d);
                let digit = p2 % 10n;

                p2 = p2*10n + digit;
                p2 = (p2*d) + p1;

                if (p2 % divisor == 0)
                    subTotal += 1n;
            }
        }

        total += subTotal;
    }
    return Number(total);
}

function normal(modulo, digits, trace)
{
    let outside = new Map();
    let inside  = new Map();

    let divisor = BigInt(modulo);

    function add(map, value)
    {
        if (value === 0n)
            return;

        value = Number(value % divisor);
        let count = map.get(value) || 0n;
        map.set(value, count+1n);
    }

    function reverse(value)
    {
        let result = 0n;

        while (value > 0)
        {
            let next = value / 10n;
            result = (result * 10n) + (value - next*10n);
            value = next;
        }
        return result;
    }

    function solve(digits)
    {
        outside.clear();
        inside.clear();

        let isOdd     = (digits & 1) !== 0;
        let half      = digits >> 1;
        let outerSize = half >> 1;
        let innerSize = half - outerSize;

        if (isOdd && innerSize > outerSize)
        {
            outerSize++;
            innerSize--;
        }

        // generate outer

        let coef= 10n ** BigInt(digits-outerSize);
        let max = 10n ** BigInt(outerSize);
        let min = 10n ** BigInt(outerSize-1);

        for (let i = min; i < max; i++)
        {
            let left   = i;
            let right  = reverse(i); // BigInt(+(i.toString().split('').reverse().join(''))) ;
            let V      = left * coef + right;

            add(outside, V);
        }

        // generate inner

        function generateInner(innerSize, coef)
        {
            if (innerSize === 0)
            {
                if (! isOdd)
                    return;

                for (let j = 0n; j < 10n; j++)
                {
                    add(inside, j * coef);
                }
                return;
            }

            let max  = 10n ** BigInt(innerSize);
            let min  = 10n ** BigInt(innerSize-1);

            for (let i = min; i < max; i++)
            {
                let left   = i;
                let right  = reverse(i);//BigInt(+(i.toString().split('').reverse().join(''))) ;

                if (isOdd)
                {
                    for (let j = 0n; j < 10n; j++)
                    {
                        let V = ((left*10n + j) * max) + right;
                        add(inside, V * coef);
                    }
                }
                else
                {
                    let V = (left* max) + right;
                    add(inside, V * coef);
                }
            }
        }

        coef= 10n ** BigInt(outerSize);
        for (let s = innerSize; s >= 0; s--)
        {
            collect();
            generateInner(s, coef);
            coef *= 10n;
        }
        collect();
        add(inside, divisor); // to add 0

        // consolidate

        let total = 0n;
        for (let e of outside)
        {
            let remainder = e[0];
            let count1    = e[1];

            let other     = modulo-remainder;
            let count2    = inside.get(other) || 0n;

            total += (count1 * count2);
        }

        return total;
    }

    //console.log(reverse(1234567n));

    let total   = 0n;
    let minSize = modulo.toString().length;

    for (let d = minSize; d <= digits; d++)
    {
        let subTotal = solve(d);

        if (trace)
            console.log(d,'=',subTotal);

        total += subTotal;
    }

    return total;
}

let solve = brute;

// console.log(solve(10919, 14));

solve = normal;

console.log('Test');

assert(solve(10919, 14), 1831);

assert(solve(10000019, 16), 8);
assert(solve(10000019, 17), 99);
assert(solve(10000019, 18), 200);

console.log('Solving now');
answer = solve(10000019, 32, true);
console.log('Answer is', answer)
