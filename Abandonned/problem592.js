const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 2n ** 48n;
const MODULO2 = 2n ** 96n;

function factorial(n) {
  let v = 1n;
  for (let i = 2n; i <= n; i++) {
    v *= i;
  }
  return v;
}

function f(max, trace) {
  const divisor = 16n;

  let result = 1n;

  max %= MODULO;

  while (max % divisor === 0n) {
    max /= divisor;
  }

  const tracer = new Tracer(trace);

  for (let value = 2n; value <= max; value++) {
    tracer.print((_) => max - value);

    let factor = value;

    while (factor % divisor === 0n) {
      factor /= divisor;
    }

    result *= factor;

    while (result % divisor === 0n) {
      result /= divisor;
    }

    result %= MODULO2;
  }

  tracer.clear();
  result %= MODULO;
  return result.toString(16).toUpperCase();
}

assert.equal(f(20n), '21C3677C82B4');
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => f(factorial(20), true));
console.log(`Answer is ${answer} - 13415DF2BE9C`);
