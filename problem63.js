const bigInt = require("big-integer");

let total = 0;

for (let power = 1; ; power++)
{
    let count = 0;
    let min = bigInt(10).pow(power-1);
    let max = min.multiply(10).subtract(1);
    for (let value = 1; ; value++)
    {
        let v = bigInt(value).pow(power);
        if (v.lesser(min))
            continue;
        if (v.greater(max))
            break;

        count++;
    }
    if (count === 0)
        break;
    total += count;
}

console.log("Total is " + total);