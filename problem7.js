const isNumberPrime = require('is-number-prime');

function* primes()
{
    yield 2;
    yield 3;

    let v = 3;
    while (true)
    {
        v++;
        if (isNumberPrime(v))
            yield v;
    }
}

let primeIterator = primes();

let count = /*6*/ 10001;
let p ;
for (let i = 0; i < count; i++)
    p = primeIterator.next().value;    

console.log("Prime #" + count + " = " + p);