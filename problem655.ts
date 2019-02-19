// Divisible Palindromes
// ---------------------
// Problem 655
// -----------
// The numbers 545, 5995 and 15151 are the three smallest palindromes divisible by 109.
// There are nine palindromes less than 100000 which are divisible by 109.

// How many palindromes less than 10^32 are divisible by 10000019 ?

namespace problem655
{
    function assert(value : number, expected : number) : void
    {
        if (value != expected)
        {
            console.log("Error: expecting " + expected + " but got " + value);
            process.exit(-1);
        }
    }

    function *generateOdd(start: bigint, len: bigint, power: bigint): Iterable<bigint>
    {
        if (len < 0)
        {
            yield start;
            return;
        }

        let steps = 10n**power + 1n;
        if (steps === 2n) // fix error
            steps = 1n;

        steps *= 10n**len;

        if (steps > start)
            return;

        for (let v = 0; v <= 9; v++)
        {
            yield *generateOdd(start, len-1n, power+2n);

            if (start % 10n === 9n && steps % 10n === 1n)
                break;
            start += steps;
        }
    }

    function solve(modulo:number, maxSize:number, minSz: number = 0) : number
    {
        let divisor : bigint = BigInt(modulo);
        let total   : bigint = 0n;
        let minSize : number = divisor.toString().length;

        if (minSz !== 0)
        {
            if ((minSz & 1) == 0)
                minSz--;
            if (minSize < minSz)
                minSize = minSz;
        }

        if ((minSize & 1) == 0) // dont care for first even ( at least with given input)
            minSize += 1;

        // ODD length
        for (let l = minSize; l <= maxSize; l += 2)
        {
            let subTotal = 0n;
            let po       = BigInt(l-1);
            let start    = 10n**po + 1n;

            let power = BigInt(Math.floor(l / 2));

            let d = 10n ** power;
            for (let p of generateOdd(start, power, 0n))
            {
                if (p % divisor === 0n)
                    subTotal += 1n;

                if (l+1 <= maxSize)
                {
                    // calculate the odd length palindrome
                    let p1 = p % d;
                    let p2 = (p / d);
                    let digit = p2 % 10n;

                    p2 = p2*10n + digit;
                    p2 = (p2*d) + p1;

                    if (p2 % divisor === 0n)
                        subTotal += 1n;
                }
            }

            total += subTotal;
        }
        return Number(total);
    }

    function solve2(modulo: number, digits: number): number
    {
        let outside = new Map<number, number>();
        let inside  = new Map<number, number>();

        function add(map: Map<number, number>, remainder: number)
        {
            let v: number = map.get(remainder) || 0;
            map.set(remainder, v+1);
        }

        if ((digits & 3) != 0)
            throw 'Only supported multiples of 4';

        let dig = digits >> 2;
        let max = 10n ** BigInt(dig);

        // ABCD

        let coef = 10n ** BigInt(digits-dig);
        let divisor = BigInt(modulo);

        for (let i = 0n; i < max; i++)
        {
            let right = i;
            let left  = BigInt(+(i.toString().split('').reverse().join(''))) ;

            // Outside
            let V = left*coef + right;
            add(outside, Number(V % divisor));

            // Inside
            V = (left*max + right) * max;
            add(inside, Number(V % divisor));
        }

        let total = 0;
        for (let e of outside)
        {
            let remainder = e[0];
            let count1    = e[1];

            let other     = (modulo-remainder) % modulo;
            let count2    = inside.get(other) || 0;

            total += (count1 * count2);
        }

        return total;
    }

    console.log('Test');
    // assert(solve(109, 5), 9);

    console.log(solve(109, 8));
    console.log(solve2(109, 8));

    assert(solve2(10000019, 16), 8);

    // assert(solve(10000019, 16), 8);
    // assert(solve(10000019, 17), 91);
    // assert(solve(10000019, 18), 101);

    console.log('Solving now');
    let answer = solve2(10000019, 32);
    console.log('Answer is', answer);
}
