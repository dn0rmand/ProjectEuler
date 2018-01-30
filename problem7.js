const primes = require('./tools/primes.js');

let primeIterator = primes();

let count = /*6*/ 10001;
let p ;
for (let i = 0; i < count; i++)
    p = primeIterator.next().value;    

console.log("Prime #" + count + " = " + p);