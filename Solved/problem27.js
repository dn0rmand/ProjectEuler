const isNumberPrime = require('@dn0rmand/project-euler-tools/src/isPrime');

function primeCount(a, b) {
  function quadratic(n) {
    return (n * n) + (a * n) + b;
  }

  function isPrime(v) {
    if (v < 2)
      return false;

    if (v === 2 || v === 3)
      return true;
    return isNumberPrime(v);
  }

  let n = -1;

  while (true) {
    n++;
    let v = quadratic(n);
    if (!isPrime(v))
      return n;
  }
}

function findMax() {
  let max = { count: 0, A: 0, B: 0 };

  function test(a, b) {
    let primes = primeCount(a, b);

    if (max.count < primes) {
      max.count = primes;
      max.A = a;
      max.B = b;
    }
  }

  for (let a = 0; a < 1000; a++) {
    for (let b = 0; b <= 1000; b++) {
      test(a, b);
      test(-a, b);
      test(a, -b);
      test(-a, -b);
    }
  }

  return max;
}

function equation(a, b) {
  let str = "n^2";
  if (a !== 0) {
    if (a === 1) {
      str += '+n'
    }
    else if (a === -1) {
      str += '-n';
    }
    else {
      str += a;
      str += "*n";
    }
  }
  if (b !== 0) {
    if (b >= 0)
      str += '+';
    str += b;
  }

  return str;
}

console.log(equation(1, 41) + " produces " + primeCount(1, 41) + " primes: 41");
console.log(equation(-79, 1601) + " produces " + primeCount(-79, 1601) + " primes: " + (-79 * 1601));

let max = findMax();

console.log(equation(max.A, max.B) + " produces " + max.count + " primes: " + (max.A * max.B));