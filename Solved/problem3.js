const isNumberPrime = require('@dn0rmand/project-euler-tools/src/isPrime');

function* getMaxPrime(value) {
  let prime = 2;
  while (value > 1 && prime <= value) {
    if (!isNumberPrime(prime))
      prime++;
    else if ((value % prime) === 0) {
      yield prime;

      value = value / prime;
    }
    else
      prime++;
  }
}

function getMaxPrimeFactor(value) {
  let iterator = getMaxPrime(value);
  let max = 0;
  let total = 1;

  for (let v = iterator.next(); !v.done; v = iterator.next()) {
    max = v.value;
    total = total * max;
  }
  if (total !== value)
    throw "Invalid result";

  console.log("Max prime of " + value + " is " + max);
}

const TEST_VALUE = 13195;

const VALUE = 600851475143;

getMaxPrimeFactor(TEST_VALUE);
getMaxPrimeFactor(VALUE);
