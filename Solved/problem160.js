// Factorial trailing digits
// Problem 160
// For any N, let f(N) be the last five digits before the trailing zeroes in N!.
// For example,

// 9! = 362880 so f(9)=36288
// 10! = 3628800 so f(10)=36288
// 20! = 2432902008176640000 so f(20)=17664

// Find f(1,000,000,000,000)

const assert = require('assert');
const bigInt = require('big-integer');
const prettyHrtime = require('pretty-hrtime');

function f(max) {
  const modulo = 1000000000;
  const MOD = 100000;

  let result = 1;

  while (max % MOD === 0 && max % 5 === 0) max /= 5;

  for (let value = 2; value <= max; value++) {
    let factor = value;

    // while (factor % 5 === 0 && result % 2 === 0)
    // {
    //     factor /= 5;
    //     result /= 2;
    // }
    // while (factor % 2 === 0 && result % 5 === 0)
    // {
    //     factor /= 2;
    //     result /= 5;
    // }

    while (factor % 10 === 0) factor /= 10;

    result *= factor;

    while (result % 10 === 0) result /= 10;

    result %= modulo;
  }

  result %= MOD;
  return result;
}

assert.equal(f(100), 16864);
assert.equal(f(1000), 53472);
assert.equal(f(10000), 79008);
assert.equal(f(100000), 62496);
assert.equal(f(1000000), 12544);
assert.equal(f(10000000), 94688);

let start = process.hrtime();
let answer = f(1000000000000);
let end = process.hrtime(start);
console.log('f(1,000,000,000,000) = ' + answer + ', solved in ' + prettyHrtime(end, { verbose: true }));
