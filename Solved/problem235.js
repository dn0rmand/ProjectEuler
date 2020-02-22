const timerLogger = require('tools/timeLogger');

const MAX    = 5000;
const TARGET = -600000000000;

function getSum(r)
{
    let total = TARGET;
    
    for(let i = 0, c = 900-3, rr = 1; i < MAX; i++, c -= 3, rr *= r)
        total -= c * rr;

    return total;
}

function solve(digits)
{
    let values = [1, '.'];

    while (values.length <= digits+2)
    {
        let digit = 0;

        for(let d = 1; d < 10; d++)
        {
            values.push(d);
            const value = +(values.join(''));
            values.pop(d);
            const sum = getSum(value); 
            if (sum <= 0)
                digit = d;
            else
                break;
        }
        values.push(digit);
    }

    let answer = +(values.join(''));

    return answer.toFixed(digits);
}

answer = timerLogger.wrap('', () => solve(12));

console.log(`Answer is ${answer}`);