function* collatz(start)
{
    yield start;

    let previous = start;
    while (start !== 1)
    {
        if ((start & 1) === 0) // Even
        {
            start = start / 2;
        }
        else
        {
            start = (3*start)+1;
        }

        if (start !== previous)
        {
            previous = start;
            yield start;
        }
        else
            break;
    }
    if (start !== 1)
        throw "Something went wrong!";
}

function getSequenceLength(start)
{
    let length = 0;
    let sequence = collatz(start);

    for(let current = sequence.next(); !current.done; current = sequence.next())
    {
        length++;
    }
    return length;
}

let max = 0;
let maxValue = 0;

for(let i = 1; i < 1000000; i++)
{
    let length = getSequenceLength(i);
    if (i === 13)
        console.log('Length for 13 is ' + length);
    if (length > max)
    {
        max = length;
        maxValue = i;
    }
}

console.log('longest chain is ' + max + ' when starting with ' + maxValue);