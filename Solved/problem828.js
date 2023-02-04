const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const problems = require('../data/p828.json');

function combine({ value: a, score: sa }, { value: b, score: sb }) {
  const score = sa + sb;
  let divided = 0;
  if (a % b === 0) {
    divided = a / b;
  } else if (b % a === 0) {
    divided = b / a;
  }

  return [
    { value: a + b, score },
    { value: a * b, score },
    { value: a > b ? a - b : b - a, score },
    { value: divided, score },
  ];
}

// global values

let target, bestScore;

function calculate(numbers) {
  // Filter out the number with a score not better than the current one
  if (bestScore) {
    const minScore = numbers.reduce((m, n) => Math.min(m, n.score), bestScore);
    if (minScore >= bestScore) {
      return; // Can't do better
    }
    numbers = numbers.filter((n) => n.score + minScore < bestScore);
  }
  // build more now
  for (let i = 0; i < numbers.length; i++) {
    const ni = numbers[i];
    const nextSet = numbers.filter((_n, index) => index !== i);

    for (let j = i; j < nextSet.length; j++) {
      const nj = nextSet[j];
      if (bestScore && ni.score + nj.score >= bestScore) {
        continue;
      }

      for (const newNumber of combine(ni, nj)) {
        if (newNumber.value === target) {
          if (!bestScore || bestScore > newNumber.score) {
            bestScore = newNumber.score;
          }
        } else if (newNumber.value) {
          nextSet[j] = newNumber;
          calculate(nextSet);
          nextSet[j] = nj;
        }
      }
    }
  }
}

function S(n) {
  const p = problems[n - 1];
  const numbers = p.numbers.map((n) => ({ value: n, score: n }));

  target = p.target;
  bestScore = 0;

  calculate(numbers);

  return bestScore;
}

function solve() {
  const MODULO = 1005075251;

  let total = 0;
  const tracer = new Tracer(true);
  const TREE = 3;
  for (let n = 1; n <= problems.length; n++) {
    tracer.print((_) => n);
    const s = S(n);
    if (s) {
      total = (total + s.modMul(TREE.modPow(n, MODULO), MODULO)) % MODULO;
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(S(1), 40);

console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
