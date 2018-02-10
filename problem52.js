function getDigits(value)
{
    return value.toString().split('').sort().join('');
}

function Works(value)
{
    let k = getDigits(value);

    if (getDigits(value*2) !== k)
        return false;
    if (getDigits(value*3) !== k)
        return false;
    if (getDigits(value*4) !== k)
        return false;
    if (getDigits(value*5) !== k)
        return false;
    if (getDigits(value*6) !== k)
        return false;

    return true;
}

for(let value = 1; ; value++)
{
    if (Works(value))
    {
        console.log("Smallest positive integer, x, such that 2x, 3x, 4x, 5x, and 6x, contain the same digits is " + value);
        break;
    }
}