function squareOfTheSum(min, max)
{
    let sum = 0;

    for(let i = min; i <= max; i++)
        sum += i;

    return sum * sum;
}

function sumOfTheSquares(min, max)
{
    let sum = 0;

    for(let i = min; i <= max; i++)
        sum += (i * i);

    return sum;
}

function solve(max)
{
    let v1 = sumOfTheSquares(1, max);
    let v2 = squareOfTheSum(1, max);

    console.log("Solution for " + max + " is " + Math.abs(v1 - v2));
}

solve(10);
solve(100);