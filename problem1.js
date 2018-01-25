function getMultipleSum(MAX, factor, notFactor)
{
    let sum = 0;
    let value = MAX;
    while (--value > 0)
    {
        if ((value % factor) === 0)
            break;
    }
    while (value >= factor)
    {
        if (notFactor === undefined || (value % notFactor) !== 0)
            sum += value;

        value -= factor;
    }

    return sum;
}

function solve(max)
{
    let sum1 = getMultipleSum(max, 5);
    let sum2 = getMultipleSum(max, 3, 5);

    console.log("Result for " + max + " is " + (sum1+sum2));
}

solve(10);
solve(1000);