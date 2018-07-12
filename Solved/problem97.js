const bigInt = require('big-integer');

let max   = 10000000000;
let power = 1;
for(let i = 0; i < 7830457; i++)
{
    power = (power * 2) % max;
}
let prime = ((power * 28433)+1) % max;
let p = prime.toString();
console.log('Result is ' + p + " ( " + p.length + " )");
