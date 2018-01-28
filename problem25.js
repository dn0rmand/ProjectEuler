const bigInt = require("big-integer");

function calculateMax(digits)
{
    let max = bigInt(10).pow(digits-1);
    let check = max.toString();
    if (check.length !== digits)
        throw "Invalid Max calculation";

    return max;
}

function *fibonacci()
{
    let term1 = bigInt(1);
    let term2 = bigInt(1);

    yield term1;
    
    while (true)
    {
        yield term2;

        let newterm = term2.add(term1);
        term1 = term2;
        term2 = newterm;
    }
}

function Solve(digits)
{
    let MAX   = calculateMax(digits);
    let fib   = fibonacci();
    let index = 0;

    while (true)
    {
        index++;

        let f = fib.next();
        if (f.value.greaterOrEquals(MAX))
            break;
    }

    console.log("Index of the first term in the Fibonacci sequence to contain " + digits + " digits is " + index);        
}

Solve(3); // Should be 12
Solve(1000);