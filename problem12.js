function* triangle()
{
    let v = 0;
    let i = 1;

    while(true)
    {
        v = v + i;

        yield v;

        i++;
    }
}

function getDivisorCount(value)
{
    let divisor = 2; // 1 and self
    let max = value;
    for(let i = 2; i < max; i++)
    {
        if ((value % i) == 0)
        {
            let res = value / i;
            if (res < max)
                max = res;
            if (res != i)
                divisor++;
            divisor++;
        }
    }
    return divisor;
}

let numbers = triangle();
let i = 0;

while (true)
{
    i++;

    let number   = numbers.next().value;
    let divisors = getDivisorCount(number);

    if (i === 7)
        console.log(number + " is the #" + i + " and has " + divisors + " divisors");

    if (divisors > 500)
    {
        console.log("Answer is " + number + " with " + divisors + " divisors");
        break;
    }
}
