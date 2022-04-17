const primes = require('@dn0rmand/project-euler-tools/src/primes.js');

let primeIterator = primes();

let count = /*6*/ 10001;
let p ;
for (let i = 0; i < count; i++)
    p = primeIterator.next().value;    

console.log("Prime #" + count + " = " + p);