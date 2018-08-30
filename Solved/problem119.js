// Digit power sum
// ---------------
// Problem 119
// -----------
// The number 512 is interesting because it is equal to the sum of its digits raised to some power:
// 5 + 1 + 2 = 8, and 8^3 = 512. Another example of a number with this property is 614656 = 28^4.

// We shall define an to be the nth term of this sequence and insist that a number must contain at least two digits to
// have a sum.

// You are given that a2 = 512 and a10 = 614656.

// Find a30.

function digitSum(value)
{
    let sum = 0;
    while (value > 0)
    {
        let d = value % 10;
        sum += d;
        value = (value - d) / 10;
    }

    return sum;
}

function solve()
{
    let values = [];
    let found = [];

    for (let i = 2; i < 100; i++)
    {
        values[i] = i;
        if (i > 9 && digitSum(i) === i)
            found.push(i);
    }

    let current = 2;
    let lastProcessed = 0;

    while(true)
    {
        if (current === lastProcessed)
            break; // All too big
        let v = values[current] = values[current] * current;

        if (v > Number.MAX_SAFE_INTEGER)
        {
            current++;
            continue;
        }

        lastProcessed = current;
        if (v > 9 && digitSum(v) === current)
            found.push(v);

        current++;

        if (current >= 100)
            current = 2;
    }
    found.sort((a, b)=>a-b);
    return found[29];
}

console.time(119);
let answer = solve();
console.timeEnd(119);
console.log("Answer is", answer);