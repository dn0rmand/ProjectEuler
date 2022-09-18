const assert = require('assert');
const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e15;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX)) + 1;

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes();

/*
f(p^1) = 2
f(p^2) = p + 2
f(p^3) = 2*p + 2
f(p^4) = p^2 + 2*p + 2;
f(p^5) = 2*p^2 + 2*p + 2
f(p^6) = p^3 + 2*p^2 + 2*p + 2

f(p^e) = sum(i=0..e) { g(p^i)*h(p^(e-i)) }

g(p^e) = e+1
h(p^i) = 0 if i is odd, otherwise p^(i/2) - p^(i/2 - 1)
*/

function G(j, max) {
  const m = Math.floor(max / j);
  const M = Math.floor(Math.sqrt(m));
  const M2 = BigInt(M * M);
  let total = 0;
  let extra = 0n;
  for (let i = 1; i <= M; i++) {
    const v = Math.floor(m / i);
    const t = total + v;
    if (t > Number.MAX_SAFE_INTEGER) {
      extra = BigInt(total) + BigInt(v);
      total = 0;
    } else {
      total = t;
    }
  }
  return (BigInt(total) + extra) * 2n - M2;
}

function innerF(max, index, value, hValue) {
  let total = 0n;

  if (value <= max) {
    total += BigInt(hValue) * G(value, max);
  }
  for (let i = index; i <= allPrimes.length; i++) {
    const p = allPrimes[i];
    const pp = p * p;
    if (pp > max) {
      break;
    }
    let v = value * pp;
    if (v > max) {
      break;
    }

    let h = hValue * (p - 1);

    while (v <= max) {
      total += innerF(max, i + 1, v, h);
      v *= pp;
      h *= p;
    }
  }
  return total;
}

function solve(max) {
  return innerF(max, 0, 1, 1);
}

assert.strictEqual(solve(1000), 12776n);
assert.strictEqual(solve(10), 32n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(MAX));
console.log(`Answer is ${answer}`);
