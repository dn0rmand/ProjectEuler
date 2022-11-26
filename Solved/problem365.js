const {
  primeHelper,
  TimeLogger,
  Tracer,
  countPowers,
  binomial,
  chineseRemainder,
} = require('@dn0rmand/project-euler-tools');

const MIN_PRIME = 1000;
const MAX_PRIME = 5000;

const POWER = 9n;
const MAX = 10n ** (POWER + POWER);
const LIMIT = 10n ** POWER;

primeHelper.initialize(MAX_PRIME, true);

const allPrimes = primeHelper.allPrimes().filter((p) => p > MIN_PRIME && p < MAX_PRIME);

function getModulos() {
  const tracer = new Tracer(true, 'Calculating modulos');
  const lastPrime = allPrimes[allPrimes.length - 1];
  const modulos = [];

  for (const prime of allPrimes) {
    tracer.print((_) => lastPrime - prime);
    const powerBottom = countPowers(prime, LIMIT);
    const powerTop = countPowers(prime, MAX) - countPowers(prime, MAX - LIMIT);

    if (powerBottom !== powerTop) {
      modulos.push({ prime, modulo: 0 });
    } else {
      modulos.push({ prime, modulo: binomial(MAX, LIMIT, prime) });
    }
  }
  tracer.clear();
  modulos.sort((a, b) => b.modulo - a.modulo);
  return modulos;
}

function solve() {
  const modulos = getModulos();

  const tracer = new Tracer(true, 'Solving');

  let total = 0n;

  for (let pi = 0; pi < modulos.length; pi++) {
    tracer.print((_) => modulos.length - pi);
    const { prime: p, modulo: a } = modulos[pi];
    for (let qi = pi + 1; qi < modulos.length; qi++) {
      const { prime: q, modulo: b } = modulos[qi];
      const pq = p * q;
      const m = chineseRemainder(p, q, a, b);
      for (let ri = qi + 1; ri < modulos.length; ri++) {
        const { prime: r, modulo: c } = modulos[ri];
        const mm = chineseRemainder(pq, r, m, c);
        total += BigInt(mm);
      }
    }
  }
  tracer.clear();
  return total;
}

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
