const ZERO = '0'.charCodeAt(0);

function calculateNext(value)
{
    let newValue = 0;

    while (value > 0)
    {        
        let digit = value % 10;
        value = (value - digit) / 10;
        newValue += (digit*digit);
    }

    return newValue;
}

function calculateEndValue(start)
{
    let value = start;
    while (value !== 1 && value !== 89)
        value = calculateNext(value);
    return value;
}

if (calculateEndValue(44) !== 1)
    throw "44 should give 1";
if (calculateEndValue(85) !== 89)
    throw "85 should give 89";

let count = 0;

for (let value = 1; value < 10000000; value++)
{
    if (calculateEndValue(value) === 89)
        count++;
}
console.log(count + " starting numbers below ten million will arrive at 89");
