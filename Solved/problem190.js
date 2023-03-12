const assert = require('assert');
const { TimeLogger } = require("@dn0rmand/project-euler-tools");

function calculate(values) {
  let t = 1;
  let m = values.length;
  for (let p = 1; p <= m; p++) {
    t *= (values[p - 1] ** p);
  }

  return t;
}

function randomP(m) {
  if (m === 1)
    return 1;

  function rnd(min, max) {
    let v = max - min + 1;

    v = Math.floor((Math.random() * v) + min);
    if (v < min)
      v = min;
    else if (v > max)
      v = max;

    return v;
  }

  const values = Array(m).fill(1);
  const THRESOLD = 1000;

  let tries = THRESOLD;
  let max = 1;
  let offset = 0.0000001;

  while (tries) {
    let i = rnd(1, m) - 1;
    let j = m - i - 1;
    if (i === j)
      continue;
    if (i > j) {
      j = i;
      i = m - i - 1;
    }

    let a = values[i];
    let b = values[j];

    values[i] = a - offset;
    values[j] = 2 - values[i];

    let p = calculate(values);
    if (p < max) {
      values[i] = a;
      values[j] = b;
      tries--;
    }
    else if (p > max) {
      max = p;
      tries = THRESOLD;
    }
  }

  console.log(`${m} - ${Math.floor(max)}`);
  return Math.floor(max);
}

function slowP(m) {
  const values = Array(m).fill(1);

  const PRECISION = 8;
  const SPEED_INDEX = 4;
  const SPEED = Math.pow(10, SPEED_INDEX);

  const OFFSET = Math.pow(10, -PRECISION);

  let max = 1;
  for (let i = 0; i < m - 1; i++) {
    let j = m - 1 - i;
    if (i >= j)
      break;

    let factor = SPEED;

    while (factor > 1) {
      factor /= 10;

      const offset = OFFSET * factor;

      let maxB = values[j] - offset;
      let maxA = 2 - maxB;

      values[i] = maxA;
      values[j] = maxB;
      max = calculate(values);

      while (true) {
        let A = values[i] - offset;
        let B = 2 - A;

        values[i] = A;
        values[j] = B;

        let p = calculate(values);
        if (p < max) {
          values[i] = maxA;
          values[j] = maxB;
          break;
        }
        else {
          max = p;
          maxA = values[i];
          maxB = values[j];
        }
      }
    }
  }

  return Math.floor(max);
}

function fastP(m) {
  const values = [];

  for (let i = 1; i <= m; i++) {
    values.push((i + i) / (m + 1));
  }

  const max = calculate(values);
  return Math.floor(max);
}

let P = fastP;

function solve(min, max) {
  let total = 0;
  for (let m = 2; m <= max; m++) {
    let p = P(m);
    total += p;
  }
  return total;
}

function execute(p) {
  P = p;
  assert.equal(P(10), 4112);

  const answer = TimeLogger.wrap('', _ => solve(2, 15));
  console.log('Answer is', answer);
}

execute(fastP);
execute(slowP);
// execute(randomP);
