const MAX = 4000000;

function fibonacci()
{
    let term1 = 1;
    let term2 = 1;
    let sum   = 0;
    while (term2 < MAX)
    {
        if ((term2 & 1) === 0)
        {
            sum += term2;
        }

        let newterm = term2 + term1;
        term1 = term2;
        term2 = newterm;
    }

    return sum;
}

let result = fibonacci();

console.log('Problem 2 result is ' + result);