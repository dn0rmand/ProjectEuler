const lines = [
    'FAB',
    'GBC',
    'HCD',
    'IDE',
    'JEA'
];

const magicRing = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0
}

const values = [1,2,3,4,5,6,7,8,9,10];

function calculate()
{
    let total = -1;

    for(let line of lines)
    {
        let count = 0;
        for(let letter of line)
        {
            count += magicRing[letter];
        }
        if (total === -1)
            total = count;
        else if (total !== count)
            return -1;
    }

    return total;
}

function getString()
{
    let min = 11;
    let start = -1;
    let length = lines.length;
    for(let i = 0; i < length; i++)
    {
        let letter = lines[i][0];
        let value  = magicRing[letter];
        if (value < min)
        {
            min = value;
            start = i;
        }
    }

    let str = '';

    for(let i = 0; i < length; i++)
    {
        let line = lines[(i+start) % length];
        for(let letter of line)
            str += magicRing[letter];
    }

    return str;
}

let max = -1;

function fillRing(used, letter)
{
    if (letter > 'J')
    {
        let value = calculate();
        if (value >= 0)
        {
            let str = getString();
            if (str.length === 16)
            {
                let v = +str;
                if (v > max)
                    max = v;
            }
        }
        return;
    }
    for(let i = 1; i <= 10; i++)
    {
        if (used[i] !== 1)
        {
            used[i] = 1;
            magicRing[letter] = i;
            fillRing(used, String.fromCharCode(letter.charCodeAt(0)+1));
            magicRing[letter] = 0;
            used[i] = 0;
        }
    }
}

fillRing([], 'A');
console.log('Max 16 digit value is ' + max);