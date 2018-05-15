function *solutions()
{
    function *inner(x, y)
    {
        while (true)
        {
            let x1 = (3*x) + (4*y) + 5;
            let y1 = (2*x) + (3*y) + 3;

            yield y1;

            x = x1;
            y = y1;
        }
    }

    let s1 = inner(-1, 0);
    let s2 = inner( 0, 0);

    while(true)
    {
        yield s1.next().value;
        yield s2.next().value;
    }
}

function solve(count)
{
    let total = 0;

    for (let value of solutions())
    {
        total += value;
        last = value;
        count--;
        if (count === 0)
            break;
    }
    return total;
}

let answer = solve(40);

console.log("The sum of the first forty terms of this sequence is " + answer);
