"use strict"

module.exports = function(value, base)
{
    if (value === 0)
        return [0];

    if (base === undefined)
        base = 10;

    let digits = [];

    while (value > 0)
    {
        let d = value % base;
        value = (value-d) / base;
        digits.push(d);
    }
    digits = digits.reverse();
    return digits;
}
