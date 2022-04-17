const primes = require('@dn0rmand/project-euler-tools/src/primes.js');
const isNumberPrime = require('is-number-prime');

function isPrime(value)
{
    if (value === 2 || value === 3)
        return true;
    else
        return isNumberPrime(value);
}

function isTruncatable(value)
{
    function innerLeft(v)
    {
        if (! isPrime(v))
            return false;
        if (v < 10) 
            return true;

        let v2 = +(v.toString().substring(1));

        return innerLeft(v2);
    }

    function innerRight(v)
    {
        if (! isPrime(v))
            return false;
        if (v < 10) 
            return true;

        let v1 = (v - (v % 10))/10;

        return innerRight(v1) ;
    }

    if (value < 10)
        return false;
    else
        return innerRight(value) && innerLeft(value);
}

let iterator = primes();
let count    = 0;
let sum      = 0;
for(let p = iterator.next(); !p.done; p = iterator.next())
{
    if (isTruncatable(p.value))
    {
        count++;
        sum += p.value;
        if (count === 11) 
            break;
    }
}
console.log('Sum of the 11 primes truncatable from both sides: ' + sum);