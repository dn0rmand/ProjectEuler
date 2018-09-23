// Flexible digit sum
// ------------------
// Problem 637
// -----------
// Given any positive integer n, we can construct a new integer by inserting plus signs between some of the digits of
// the base B representation of n, and then carrying out the additions.

// For example, from n = 123(10) (n in base 10) we can construct the four base 10 integers 123(10), 1+23 = 24(10),
// 12+3=15(10) and 1+2+3=6(10)

// Let f(n,B) be the smallest number of steps needed to arrive at a single-digit number in base B.
// For example, f(7,10)=0 and f(123,10)=1

// Let g(n,B1,B2) be the sum of the positive integers i not exceeding n such that f(i,B1)=f(i,B2)

// You are given g(100,10,3)=3302

// Find g(1E7,10,3)

const bigInt = require('big-integer');
const assert = require('assert');

const memoize = [];
const numbers = [
    new Map(), // base 10
    new Map()  // base 3
]

function toDigits(n, B)
{
    if (n === 0)
        return [0];

    let digits = [];

    while (n > 0)
    {
        let d = n % B;
        n = (n-d) / B;
        digits.push(d);
    }
    return digits;
}

function f(n, B)
{
    if (B !== 10 && B !== 3)
        throw "Only base 3 or 10 supported";

    if (n < B)
        return 0;

    let cache = memoize[n];
    if (cache === undefined)
        memoize[n] = cache = [];

    let cacheIndex = B === 10 ? 0 : 1;

    let result = cache[cacheIndex];
    if (result !== undefined)
        return result;

    let digits = toDigits(n, B);

    if (digits.length < 2)
    {
        cache[cacheIndex] = 0;
        return 0;
    }

    function trimDuplicates(nums)
    {
        let set = new Set();

        nums = nums.filter((v) => {
            if (set.has(v))
                return false;
            set.add(v);
            return true;
        });

        return nums;
    }

    function makeKey(length)
    {
        let v = 0;
        for (let i = length; i > 0; i--)
        {
            v = (v * B) + digits[i-1];
        }
        return v;
    }

    function getNumbers(length)
    {
        // Easy cases
        if (length === 0)
            return [0];
        else if (length === 1)
            return [digits[0]];
        else if (length === 2)
        {
            return trimDuplicates([
                digits[0]+digits[1],
                digits[0]+(B*digits[1])
            ]);
        }
        else if (length === 3)
        {
            return trimDuplicates([
                 digits[0] +  digits[1] + digits[2],
                 digits[0] + (digits[1] + B*digits[2]),
                (digits[0] + B*digits[1]) + digits[2],
                 digits[0] + B*(digits[1] + B*digits[2])
            ]);
        }

        let k = makeKey(length);
        let nums = numbers[cacheIndex][k];

        if (nums !== undefined)
            return nums;

        nums = [];

        let prefix = 0;
        for (let i = length; i > 0; i--)
        {
            let d = digits[i-1];

            prefix = (prefix * B) + d;

            for (let v of getNumbers(i-1))
            {
                nums.push(prefix + v);
            }
        }
        nums = trimDuplicates(nums);
        numbers[cacheIndex][k] = nums;
        return nums;
    }

    let visited = [];
    let minSteps= Number.MAX_SAFE_INTEGER;

    visited[n] = 1;

    let nums = getNumbers(digits.length);

    for (let v of nums)
    {
        if (visited[v] !== undefined)
            continue;

        visited[v] = 1;

        let steps = f(v, B);
        if (steps < minSteps)
        {
            minSteps = steps;
            if (steps === 0) // cannot do better than that!!!
                break;
        }
    }

    cache[cacheIndex] = minSteps+1;

    return minSteps+1;
}

function g(n, progress)
{
    let total = 0;
    let extra = bigInt.zero;

    let percent = "";
    let count   = 0;

    for (let i = n; i > 0; i--)
    {
        let f1 = f(i, 10);
        let f2 = -1;//f(i, 3);

        if(f1 === f2)
        {
            let t = total + i;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra = extra.plus(total).plus(i);
                total = 0;
            }
            else
                total = t;
        }

        if (progress && count === 0)
        {
            let p = (((n-i)*100) / n).toFixed(0);
            if (p !== percent)
            {
                percent = p;
                console.log(p);
            }
        }

        if (++count > 1000)
            count = 0;
    }

    return extra.plus(total).toString();
}

// assert.equal(f(7,10), 0);
// assert.equal(f(123,10), 1);

// assert.equal(g(100), "3302");

let answer = g(1E7, true);

console.log('Answer is', answer);
