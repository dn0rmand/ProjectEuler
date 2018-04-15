// Find the largest 0 to 9 pandigital that can be formed by concatenating products
// Problem 170 
// Take the number 6 and multiply it by each of 1273 and 9854:

// 6 × 1273 = 7638
// 6 × 9854 = 59124

// By concatenating these products we get the 1 to 9 pandigital 763859124. We will call 763859124 the 
// "concatenated product of 6 and (1273,9854)". Notice too, that the concatenation of the input numbers, 
// 612739854, is also 1 to 9 pandigital.

// The same can be done for 0 to 9 pandigital numbers.

// What is the largest 0 to 9 pandigital 10-digit concatenated product of an integer with two or more other integers, 
// such that the concatenation of the input numbers is also a 0 to 9 pandigital 10-digit number?

function *pandigitals()
{
    let used = [];

    function *makeNumbers(value, usedCount)
    {
        if (usedCount === 10)
        {
            yield value;
            return;
        }

        for (let d = 9; d >= 0; d--)
        {
            if (used[d] === 1)
                continue;

            used[d] = 1;
            yield *makeNumbers((value * 10) + d, usedCount + 1);
            used[d] = 0;
        }
    }

    yield *makeNumbers(0, 0)
}

function isPandigital(value)
{
    const max = 10000000000;
    const min = max / 10;
    if (value >= max || value < min)
        return false;

    let used = [];

    for (let mask = min; mask > 1; mask /= 10)
    {
        let rest = (value % mask);
        digit = (value - rest) / mask;
        value = rest;

        if (used[digit])
            return false;
        used[digit] = 1;
    }
    if (value > 9)
        return false;
    if (used[value])
        return false;
    return true;
}

let maxResult = 9765312048;
let description = ['9x1 | 9x85 | 9x34672 = 9765312048'];

function solve(value, MASK)
{
    let inputs = value % MASK;
    let factor = (value - inputs) / MASK;

    for(let mask = MASK; mask > 1; mask /= 10)
    {
        let input1 = inputs % mask;
        let input2 = (inputs - input1) / mask;

        if (input1 === 0 || input2 === 0)
            continue;
            
        let res1 = factor*input1;
        let res2 = factor*input2;
        let res = +(res1.toString() + res2.toString());
        if (res < maxResult)
            continue;

        if (isPandigital(res))
        {
            if (res > maxResult)
                description = [];
            description.push(factor + 'x' + input1 + ' | ' + factor + 'x' + input2 + ' = ' + res);
            maxResult = res;
        }
    }
}


for(let value of pandigitals())
{
    solve(value, 1000000000);
    solve(value, 100000000);
    solve(value, 10000000);
    solve(value, 1000000);
    solve(value, 100000);
    solve(value, 10000);
    solve(value, 1000);
    solve(value, 100);
    solve(value, 10);
}

console.log(maxResult + ' ( 9873614520 )');
for(let d of description)
    console.log(d);
console.log('done');