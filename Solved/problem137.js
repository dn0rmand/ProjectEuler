// http://oeis.org/A081018
const fib = require('tools/fibonacci');

function solve(n)
{
    let total = 0;
    for (let x = 3; x < 4*n + 3; x += 4)
    {
        total += fib(x).f0;
    }    
    return total;
}

let answer = solve(15);
console.log("Answer is", answer);