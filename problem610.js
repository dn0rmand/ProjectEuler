const romanNumeral = require("js-roman-numerals");

function convert(number)
{
    if (number === '')
        return false;

    try
    {
        let num  = new romanNumeral(number);
        if (num.roman !== number)
            return undefined;
        let num2 = new romanNumeral(num.decimal);
        if (num.roman !== num2.roman)
            return undefined;

        return num;
    }
    catch(e)
    {
        return undefined;
    }
}

function addLetter(number, letter)
{
/* 
    if (letter === 'V' || letter === 'D' || letter === 'L')
    {
        if (number.indexOf(letter) >= 0)
            return undefined;
    }
    // C can only be placed before D and M.
    if (letter === 'D' || letter === 'M')
    {
        if (number !== '' && !number.endsWith('C'))
            return undefined;
    }
    // X can only be placed before L and C
    if (letter === 'L' || letter === 'C')
    {
        if (number !== '' && !number.endsWith('X'))
            return undefined;
    }
    // I can only be placed before V and X.    
    if (letter === 'V' || letter === 'X')
    {
        if (number !== '' && !number.endsWith('I'))
            return undefined;
    }
*/
    let r = convert(number+letter);

    return r;
}

let letters = ['I', 'V', 'X', 'L', 'C', 'D', 'M', '#'];
let pool = [];

letters.forEach(c => {
    if (c === '#')
    {
        pool.push(c); // 2% => 1 out of 50
    }
    else
    {
        for (let i = 0; i < 7; i++) 
            pool.push(c); // 14% => 7 out of 50
    }
});

if (pool.length != 50)
    throw "Something went wrong!";

let roman  = undefined;

while (true)
{
    let index = Math.round(Math.random() * pool.length);
    let c = pool[index];
    if (c === '#')
    {
        if (roman !== undefined)
            break;
    }
    let value;
    if (roman === undefined)
        value = addLetter('', c);
    else
        value = addLetter(roman.roman, c);

    if (value !== undefined)
    {
        roman = value;
        console.log(roman.roman);
    }
}

console.log(roman.decimal);
