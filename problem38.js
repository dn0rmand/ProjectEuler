const MAX = 987654321;

function makePandigital(value, N)
{
    let str = "";

    for (let n = 1; n <= N; n++)
    {
        str += (n*value);
        if (str.length > 9)
            return -1;
    }
    if (str.length !== 9)
        return -1;

    let used = {};

    for(let i = 0; i < str.length; i++)
    {
        let c = str[i];
        if (c === '0' || used[c] !== undefined)
            return -1;

        used[c] = 1;
    }

    return +str;
}

let P = 1;
let N = 2;

let max = 0;

for (let P = 1; P <= 9999; P++) // Just guessing!!!
{
    for (let N = 2; N <= 9; N++) // Here too!!!
    {
        let value = makePandigital(P, N);
        if (value > max)
        {
            max = value;
            if (max === MAX)
                break; // That the best possible!!!!!
        }
    }
}


console.log(max);


