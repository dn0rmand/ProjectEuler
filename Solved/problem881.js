const assert = require('assert');
const { TimeLogger, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e4;

primeHelper.initialize(1e7);
const allPrimes = primeHelper.allPrimes().map(p => BigInt(p));

function factorize(n) {
  const primes = [];

  primeHelper.factorize(n, (_, e) => primes.push(e));
  primes.sort((a, b) => b - a);
  return primes;
}

const $G = new Map();

function makeKey(value) {
  const k = Object.keys(value).sort((a, b) => a - b).reduce((a, p) => {
    a.push(`${p}^${value[p]}`);
    return a;
  }, []).join('*');
  return k;
}

function G(primes) {
  const key = +(primes.join(''));

  let max = $G.get(key);
  if (max !== undefined) {
    return max;
  }

  primes = primes.map((power, index) => ({ prime: index, power }));

  function inner(values) {
    const newValues = [];
    const visited = new Set();

    for (const value of values) {
      for (const { prime, power } of primes) {
        if ((value[prime] || 0) < power) {
          const newValue = {
            ...value,
            [prime]: (value[prime] || 0) + 1,
          };

          const k = makeKey(newValue);

          if (!visited.has(k)) {
            visited.add(k);
            newValues.push({
              ...value,
              [prime]: (value[prime] || 0) + 1,
            });
          }
        }
      }
    }
    return newValues;
  }

  let values = primes.map((_, index) => ({ [index]: 1 }));
  max = values.length;

  while (values.length > 0) {
    values = inner(values);
    if (values.length < max) {
      break;
    }
    max = values.length;
  }

  $G.set(key, max);
  return max;
}

function g(n) {
  const primes = factorize(n);
  const max = G(primes);
  return max;
}

function solve() {
  const MAX_LENGTH = 12;

  let best = undefined;

  function setBest(value) {
    if (!best || value < best) {
      best = value;
    }
  }

  function inner(value, powers, maxPower) {
    if ((best && value >= best) || powers.length >= MAX_LENGTH) {
      return;
    }

    if (G(powers) >= MAX) {
      setBest(value);
      return;
    }

    let prime = allPrimes[powers.length];
    let newValue = value;

    for (let power = 1; power <= maxPower; power++) {
      newValue *= prime;
      powers.push(power);

      try {
        const v0 = G(powers);

        if (v0 >= MAX) {
          setBest(newValue);
          break;
        }
        if (best && newValue >= best) {
          break;
        }
        inner(newValue, powers, power);
      }
      finally {
        powers.pop();
      }
    }
  }

  inner(1n, [], 4);
  return best;
}

assert.strictEqual(g(45), 2);
assert.strictEqual(g(5040), 12);
console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);