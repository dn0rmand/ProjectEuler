const { Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e6, true);

// F(n) = (7n+15)/(18(n+1))
function F(n) {
  const t = 7 * n + 15;
  const b = 18 * (n + 1);

  return t / b;
}

function solve() {
  let total = 0;
  let count = 0;

  for (const prime of primeHelper.allPrimes()) {
    if (prime === 2) {
      continue;
    }

    total += F(prime);
    count += 1;
  }

  const answer = (total / count).toFixed(10);
  return answer;
}

const answer = solve();
console.log(`Answer is ${answer}`);
