const { TimeLogger, primeHelper, linearRecurrence } = require('@dn0rmand/project-euler-tools');
const assert = require('assert');

primeHelper.initialize(1e6);

const log = Math.log;

/*
 x^y + kx*n = y^x + ky*n  => y*log(x) = x*log(y)
*/

function baseLog(x, y) {
  return log(y) / log(x);
}

function F(x, y, n) {
  const m = log(n);
  let v1 = y * log(x);
  let v2 = x * log(y);
  const k1 = Math.floor(v1 / m);
  if (k1 > 0) {
    v1 = v1 - k1 * m;
  }
  const k2 = Math.floor(v2 / m);
  if (k2 > 0) {
    v2 = v2 - k2 * m;
  }

  return v1 === v2;
}

function f(n) {
  const max = n * (n - 1);
  let total = 0;
  const values = [];
  for (let x = 1; x <= max; x++) {
    let subTotal = 0;
    let v2 = x.modPow(x, n);
    for (let y = x + 1; y <= max; y++) {
      v2 = v2.modMul(x, n);
      let v1 = y.modPow(x, n);
      if (v1 === v2) {
        subTotal += 1;
      }
    }
    total += 2 * subTotal + 1;
    values.push(subTotal);
  }
  //   console.log(values.join(', '));
  return total;
}

const values = [];
for (let i = 2; i < 40; i++) {
  values.push(f(i));
}
console.log(values.join(', '));
// console.log(f(5));
// console.log(f(97));

// const values = [];

// for (const n of primeHelper.allPrimes()) {
//   if (n < 50) {
//     values.push(f(n));
//   }
// }

console.log(linearRecurrence(values));
