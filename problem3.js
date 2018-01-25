const isNumberPrime = require('is-number-prime');

// function isNumberPrime(n) 
// {
//     if (n < 2 || n % 1 || n % 2 === 0 || n % 3 === 0) 
//     {
//         return false;
//     }

//     var root = Math.floor(Math.sqrt(n));

//     for (var i = 5; i <= root; i += 6) 
//     {
//         if (n % i === 0 || n % (i + 2) == 0) 
//         {
//             return false;
//         }
//     }
//     return true;
// }

function* getMaxPrime(value)
{
    let prime = 2;
    while (value > 1 && prime <= value)
    {
        if (! isNumberPrime(prime))
            prime++;
        else if ((value % prime) === 0)
        {
            yield prime;

            value = value / prime;
        }
        else
            prime++;
    }
}

function getMaxPrimeFactor(value)
{
    let iterator = getMaxPrime(value);
    let max = 0;
    let total = 1;

    for(let v = iterator.next(); ! v.done; v = iterator.next())
    {
        max = v.value;
        total = total * max;
    }
    if (total !== value)
        throw "Invalid result";

    console.log("Max prime of " + value + " is " + max);
}

const TEST_VALUE = 13195;

const VALUE = 600851475143;

getMaxPrimeFactor(TEST_VALUE);
getMaxPrimeFactor(VALUE);
