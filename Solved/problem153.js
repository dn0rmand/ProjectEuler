const assert = require('assert');
const TimeLogger = require('tools/timeLogger');

let allTime = new TimeLogger();
allTime.start();

const MAX = 1E8;

function gcd(a, b)
{
    if (a === b)
        return a;

    if (a < b)
        [a, b] = [b, a];

    let c;
    while (b !== 0)
    {
        c = a % b;
        a = b;
        b = c;
    }
    return a;
}

const $complexDivisors = new Int32Array(MAX+1);

function seedComplexDivisors()
{
    for (let i = 2; i <= MAX; i += 2)
        $complexDivisors[i] += i;

    for (let a = 1; ; a++)
    {
        let a2 = a*a;
        if (a2 >= MAX)
            break;

        for (let b = 1; b < a; b++)
        {
            let b2 = b*b;
            let ab = a2+b2;
            if (ab > MAX)
                break;

            if (gcd(a, b) !== 1)
                continue;

            let d = ab;
            let k = 1;

            while (d <= MAX)
            {
                let v = 2 * (a+b) * (d / ab);

                $complexDivisors[d] += v;

                d += ab;
                k ++;
            }
        }
    }
}

function solve(n)
{
    let extra = 0n;
    let total = 0;
    let calls = 0;
    for (let i = n; i > 0; i--)
    {
        let c = (n - (n % i))/i; // number of times 'i' is a divisor
        let d = ($complexDivisors[i] + i) * c;

        let t = total + d;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra += BigInt(total) + BigInt(d);
            total = 0;
            calls++;
        }
        else
            total = t;
    }

    return extra + BigInt(total);
}

TimeLogger.wrap("Seeding complex divisors", () => {
    seedComplexDivisors();
});

TimeLogger.wrap("Running Tests", () => {
    assert.equal(solve(5), 35);
    assert.equal(solve(1E5), 17924657155);
});

let answer = TimeLogger.wrap("Solving", () => {
    return solve(MAX);
});

console.log(`Answer is ${answer}`);
allTime.stop();
