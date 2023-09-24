const primes = require('@dn0rmand/project-euler-tools/src/primes.js')

function solve(maxValue) {
  let primeIterator = primes();

  let p = primeIterator.next().value;
  let sum = 0;

  while (p < maxValue) {
    sum += p;
    p = primeIterator.next().value;
  }

  console.log("Sum of the primes < " + maxValue + " is " + sum);
}

solve(10);
solve(2000000);