const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e4;

primeHelper.initialize(1e7);

function factorize(n) {
  const primes = [];

  primeHelper.factorize(n, (p, e) => primes.push({ prime: p, power: e }));
  return primes;
}

function G(primes, maximum) {
  primes = primes.filter(p => p.power > 0);

  function makeKey(value) {
    const k = Object.keys(value).sort((a, b) => a - b).reduce((a, p) => {
      a.push(`${p}^${value[p]}`);
      return a;
    }, []).join('*');
    return k;
  }

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
            if (maximum && newValues.length >= maximum) {
              return newValues;
            }
          }
        }
      }
    }
    return newValues;
  }

  let values = primes.map(({ prime, power }) => ({ [prime]: 1 }));
  let max = values.length;
  while (values.length > 0) {
    values = inner(values);
    if (values.length < max) {
      break;
    }
    max = values.length;
    if (maximum && max >= maximum) {
      break;
    }
  }
  return max;
}

function g(n) {
  const primes = factorize(n);
  return G(primes);
}

function exchange(primes, removed) {
  if (G(primes, MAX) >= MAX) {
    return true;
  }

  for (let i = 2; i < primes.length; i++) {
    if (primes[i].prime > removed) {
      continue;
    } else {
      primes[i].power++;
      removed /= primes[i].prime;
      let m = G(primes, MAX);
      if (m >= MAX) {
        return true;
      }
      i--;
    }
  }
  return false;
}

console.log(G([{ prime: 2, power: 2 }, { prime: 3, power: 1 }]));
console.log(G([{ prime: 2, power: 3 }, { prime: 3, power: 2 }, { prime: 5, power: 1 }]));
console.log(G([{ prime: 2, power: 4 }, { prime: 3, power: 3 }, { prime: 5, power: 2 }, { prime: 7, power: 1 }]));

const info = [
  { prime: 2, power: 3 },
  { prime: 3, power: 3 },
  { prime: 5, power: 3 },
  { prime: 7, power: 1 },
  { prime: 11, power: 1 },
  { prime: 13, power: 1 },
  { prime: 17, power: 1 },
  { prime: 19, power: 1 },
  // 23,29,31,37, 41,47,53,59
  { prime: 23, power: 1 },
  { prime: 29, power: 1 },
  { prime: 31, power: 1 },
  { prime: 37, power: 1 },
  { prime: 41, power: 1 },
  // { prime: 47, power: 1 },
];

console.log(G(info, MAX));
let answer = info.reduce((a, { prime, power }) => a * (BigInt(prime) ** BigInt(power)), 1n);
console.log(`${answer}`);
process.exit(0);

function solve() {
  let primes = [...primeHelper.allPrimes()].filter((p, i) => i < 8).map((p, i) => ({ prime: p, power: 2 }));

  let max = G(primes, MAX);

  let newPrimes = [...primes];
  let rm1 = newPrimes.pop();
  let rm2 = newPrimes.pop();
  exchange(newPrimes, (rm1.prime ** rm1.power) * (rm2.prime ** rm2.power));

  return max;
}

assert.strictEqual(g(45), 2);
assert.strictEqual(g(5040), 12);
console.log('Tests passed');

console.log(solve());