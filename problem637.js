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
const MAX    = 1E7;

const memoize3  = new Map();
const memoize10 = new Map();
const digits3   = [];

const getNumbers = [

];

function prepare3Digits()
{
    function toDigits(n)
    {
        if (n === 0)
            return [0];

        let digits = [];

        while (n > 0)
        {
            let d = n % 3;
            n = (n-d) / 3;
            digits.push(d);
        }
        digits = digits.reverse();
        return digits;
    }

    console.log('Prebuilding digits.');

    let maxCount = 0;
    for (let i = 1; i <= MAX; i++)
    {
        let digits = toDigits(i);
        digits3[i] = digits;
        if (digits.length > maxCount)
        {
            maxCount = digits.length;
            // let f = createPatternFunction(maxCount);
            // getNumbers[maxCount] = f;
        }
    }
    console.log("Max digits length is", maxCount);
}

function createPatternFunction(bitLength)
{
    function *inner(index)
    {
        if (index >= bitLength)
        {
            yield "0";
            return;
        }
        else if (index === bitLength-1)
        {
            yield "D["+index+"]";
            return;
        }

        let prefix = "";
        for (let i = index; i < bitLength; i++)
        {
            if (prefix === "")
                prefix = "D[" + i + "]";
            else
                prefix = "("+prefix+"*3 + D["+i+"])";

            for (let v of inner(i+1))
            {
                var pattern = prefix;

                if (v !== "0")
                    pattern += " + " + v;

                yield pattern;
            }
        }
    }

    let name = "__getNumbers__" + bitLength;

    let fn = "let result = function(digits) {\n";

    fn += "function *" + name + "(D) {\n"

    for (let pattern of inner(0))
    {
        fn += "  yield " + pattern + ";\n"
    }

    fn += "}\n";

    fn += "return " + name + "(digits);"
    fn += "}\n";
    fn += "result;";
    f = eval(fn);
    return f;
}

function f3(n, other)
{
    if (n < 3)
        return 0;

    let result = memoize3.get(n);
    if (result !== undefined)
        return result;

    let digits = digits3[n];

    function *getNumbers(index)
    {
        if (index >= digits.length)
        {
            yield 0;
            return;
        }
        else if (index == digits.length-1)
        {
            yield digits[index];
            return;
        }
        else if (index == digits.length-2)
        {
            yield digits[index] + digits[index+1];
            yield digits[index]*3 + digits[index+1];
            return;
        }

        let prefix = 0;

        while (index < digits.length && digits[index] === 0)
            index++;

        if (index >= digits.length)
        {
            yield 0;
            return;
        }

        for (let i = index; i < digits.length; i++)
        {
            prefix = (prefix * 3) + digits[i];

            for (let v of getNumbers(i+1))
            {
                yield prefix + v;
            }
        }
    }

    let visited = new Set();
    let minSteps= Number.MAX_SAFE_INTEGER;

    visited.add(n);

    if (other !== undefined)
        other--;

    // let iter = getNumbers[digits.length](digits);
    for (let v of /*iter) */ getNumbers(0))
    {
        if (visited.has(v))
            continue;

        visited.add(v);

        let steps = f3(v);
        if (steps < minSteps)
        {
            minSteps = steps;
            if (steps === 0) // cannot do better than that!!!
                break;
            if (other !== undefined && steps < other)
                return steps;
        }
    }

    memoize3.set(n, minSteps+1);

    return minSteps+1;
}

function f10(n)
{
    if (n < 10)
        return 0;

    let result = memoize10.get(n);
    if (result !== undefined)
        return result;

    let v = 0;
    for (let i = n; i > 0;)
    {
        let d = i % 10;
        i = (i-d) / 10;

        v += d;
    }

    result = 1 + f10(v, 10);
    memoize10.set(n, result);

    return result;
}

function executeF10()
{
    console.log('Executing f(n, 10)');
    for (let i = 1; i <= MAX; i++)
    {
        f10(i);
    }
}

function tests()
{
    console.log("Running tests");

    assert.equal(f10(7,10), 0);
    assert.equal(f10(123,10), 1);
    
    assert.equal(g(100), "3302");
}

function g(n, progress)
{
    let total = 0;
    let extra = bigInt.zero;

    let percent = "";
    let count   = 0;

    for (let i = 1; i <= n; i++)
    {
        let f1 = f10(i);
        let f2 = f3(i, f1);

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
            let p = ((i*100) / n).toFixed(0);
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

prepare3Digits();
tests();
executeF10();
console.log("Solving");

let answer = g(MAX, true);

console.log('Answer is', answer);
