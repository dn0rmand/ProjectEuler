const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('data/p079_keylog.txt')
});

let digits = [];

function processInput()
{
    let possible = -1;
    let allDone  = true;

    for (let i = 0; i < 10; i++)
    {
        let digit = digits[i];
        if (digit === undefined)
            continue;

        allDone = false;
        if (digit.after.length === 0)
        {
            if (possible !== -1)
                throw "Something went wrong";
            possible = i;
        }
    }
    if (allDone)
        return undefined;
    if (possible === -1)
        throw "Something went wrong";

    digits[possible] = undefined;
    for (let i = 0; i < 10; i++)
    {
        let digit = digits[i];
        if (digit === undefined)
            continue;

        let index = digit.after.indexOf(possible);
        if (index >= 0)
        {
            digit.after.splice(index,1 );
        }
    }
    return possible;
}

readInput
.on('line', (line) => { 
    for(let i = 0; i < line.length; i++)
    {
        let c = +(line[i]);
        let digit = digits[c];
        if (digit === undefined)
        {
            digit = { after: [] };
            digits[c] = digit;
        }
        if (i > 0)
        {
            let c1 = +(line[i-1]);
            if (! digit.after.includes(c1))
                digit.after.push(c1);
        }
    }
})

.on('close', () => {
    let passcode = '';

    while (true)
    {
        let c = processInput();
        if (c === undefined)
            break;

        passcode += c;
    }

    console.log('Passcode is ' + passcode);
    process.exit(0);
});
