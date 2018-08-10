// Almost right-angled triangles I
// Problem 223 
// Let us call an integer sided triangle with sides a ≤ b ≤ c barely acute if the sides satisfy 
// a2 + b2 = c2 + 1.

// How many barely acute triangles are there with perimeter ≤ 25,000,000?

const MAX = 25000000;

const assert = require('assert');
// const primeHelper = require('tools/primeHelper')(MAX);

function $solve(max)
{
    // a+b+c <= max
    // a <= b <= c => a <= max/3
    // a = 1 => b+c <= max-1 => b <= (max-1)/2 

    let maxA = Math.floor(max / 3);
    let maxB = Math.floor(max / 2);

    let total = 0;
    let percent = '';
    for (let a = 1; a < maxA; a++)
    {
        let p = ((a * 100) / maxA).toFixed(0);
        if (p !== percent)
        {
            percent = p;
            process.stdout.write('\r'+percent+'%');
        }

        for (let b = a; b < maxB; b++)
        {
            // a2+b2=c2+1 => c = sqrt(a2+b2-1)
            let c2 = (a*a) + (b*b) - 1;

            if (c2 > Number.MAX_SAFE_INTEGER)
                throw "TOO BIG";

            let c = Math.sqrt(c2);
            if (c === Math.floor(c))
            {
                if (c < b)
                    continue;
                let p = a+b+c;
                if (p > max)
                    continue;
                if ((p & 1) === 0)
                    throw "EVEN !!!";
                total++;
                if (total > Number.MAX_SAFE_INTEGER)
                    throw "TOO BIG";
            }
        }
    }

    console.log('.');
    return total;
}

function solve(max)
{
    let total = 0;

    // No factorisation and same method as the Alexandrian integers

    // from a triplet (a,b,c), I get the next 3 triplets
    // (2c + b - 2a, 2c + 2b - a, 3c + 2b - 2a)
    // (2c + b + 2a, 2c + 2b + a, 3c + 2b + 2a)
    // (2c - 2b + a, 2c - b + 2a, 3c - 2b + 2a)
    
    // Start from (1,1,1) and (1,2,2), be careful about duplicates when a=b, and this is it.

    function equal(A, B)
    {
        return (A.a === B.a && A.b === B.b && A.c === B.c);
    }

    function count(A, B, C)
    {
        let stack = [{ a:A, b:B, c:C }];

        while (stack.length > 0)
        {
            let pt = stack.pop();

            let a = pt.a;
            let b = pt.b;
            let c = pt.c;

            if (a+b+c > max)
                continue;

            total++;

            let A1 = { a: 2*c + b - 2*a, b: 2*c + 2*b - a, c: 3*c + 2*b - 2*a };
            let A2 = { a: 2*c + b + 2*a, b: 2*c + 2*b + a, c: 3*c + 2*b + 2*a };
            let A3 = { a: 2*c - 2*b + a, b: 2*c - b + 2*a, c: 3*c - 2*b + 2*a };

            stack.push(A1);

            if (! equal(A1, A2))
                stack.push(A2);
            if (! equal(A1, A3) && ! equal(A2, A3))
                stack.push(A3);
        }
    }

    count(1, 1, 1);
    count(1, 2, 2);

    return total;
}

assert.equal(solve(20000), 29257);

console.time(223);
let answer = solve(25000000);
console.timeEnd(223);

console.log(answer, 'barely acute triangles with a perimeter ≤ 25,000,000?');

console.log('Done');