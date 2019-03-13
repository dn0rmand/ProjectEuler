const primeHelper = require('tools/primeHelper')();

let MAX = 99999999000000;

let MAX_P = Math.sqrt(MAX)+1;

console.time(321);
primeHelper.initialize(MAX_P);
console.timeEnd(321);

console.time(123);

for (let i = 0, j = 0; i <= 1000000; i++, j++)
{
    if (j === 0)
        process.stdout.write(`\r${i}`);
    else if (j === 9999)
        j = -1;

    primeHelper.isPrime(MAX+i);
}
console.timeEnd(123);