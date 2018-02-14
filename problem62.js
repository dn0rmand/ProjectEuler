const cbrt = require('cbrt');

function *permutations(startingValue)
{
    let digits = [];
    let v = startingValue;
    while (v > 0)
    {
        digits.push(v % 10);
        v = (v - (v % 10)) / 10;
    }

    function *permute(used, value, count)
    {
        if (count === digits.length)
        {
            if (value !== startingValue)
                yield value;
        }

        for(let i = 0; i < digits.length; i++)
        {
            let digit = digits[i];
            if (count === 0 && digit === 0)
                continue; // Avoid starting with 0

            if (used[i] !== 1)
            {
                used[i] = 1;
                yield *permute(used, value*10 + digit, count+1);
                used[i] = 0;
            }
        }
    }

    yield *permute([], 0, 0);
}

for (let i = 5; ; i++)
{
    let cube = Math.pow(i, 3);

    let cubes = [cube];

    for(let value of permutations(cube))
    {
        let x = Math.pow(value, 1/3);
        let x2= Math.pow(Math.round(x), 3);

        if (x2 === value)
        {
            if (! cubes.includes(value))
                cubes.push(value);
        }
    }
    if (cubes.length > 3)
        if (cubes.length === 5)
            break;
}
