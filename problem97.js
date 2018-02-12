const bigInt = require('big-integer');

let max   = bigInt(10000000000);
let power = bigInt(2);
for(let i = 0; i < 7830457; i++)
{
    power = power.multiply(2).mod(max);
}
let prime = power.multiply(28433).add(1).mod(max);
let p = prime.toString();
console.log('Result is ' + p + " ( " + p.length + " )");
