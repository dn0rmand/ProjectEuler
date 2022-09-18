const { primeHelper, TimeLogger } = require('@dn0rmand/project-euler-tools');

function solve() {
  const squares = new Set();
  primeHelper.initialize(3e7);

  for (const p of primeHelper.allPrimes()) {
    squares.add(p * p);
  }

  function isReversible(n1) {
    const reverse = n1.toString().split('').reverse().join('');
    const n2 = +reverse;
    if (n1 === n2) {
      return false;
    }
    if (squares.has(n2)) {
      return true;
    }
    return false;
  }

  let total = 0;
  let count = 0;

  for (const square of squares.values()) {
    if (isReversible(square)) {
      total += square;
      count++;
      if (count === 50) {
        break;
      }
    }
  }

  if (count !== 50) {
    throw 'Not enough squares';
  }

  if (total > Number.MAX_SAFE_INTEGER) {
    throw 'Error';
  }

  return total;
}

const answer = TimeLogger.wrap('', (_) => {
  return solve();
});
console.log(`Answer is ${answer}`);
