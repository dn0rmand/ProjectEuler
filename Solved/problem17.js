const converter = require('written-number');

// converter.toWords(13); // => “thirteen” 

function countLetters(value)
{
    let word = converter(value);
    let length = 0;

    for (let i = 0; i < word.length; i++)
    {
        let c = word[i];
        if (c !== ' ' && c !== '-')
            length++;
    }
    return length;
}

function solve(max)
{
    let sum = 0;

    for(let i = 1 ; i <= max ; i++)
    {
        let length = countLetters(i);
        sum += length;
    }

    console.log(sum + ' letters used to write 1 to ' + max);
}

function validate(value, letters)
{
    let length = countLetters(value);
    
    if (length != letters)
    {
        console.log('ERROR: ' + value + ' has ' + letters + ' letters, not ' + word.length)
    }
}

validate(342, 23);
validate(115, 20);

solve(5);
solve(1000);