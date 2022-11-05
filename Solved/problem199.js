const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const INNER_K = 1;
const INNER_RADIUS = 1;
const OUTER_K = 3 - 2 * Math.sqrt(3);
const OUTER_RADIUS = 1 / OUTER_K;

function area(radius) {
  return Math.PI * radius ** 2;
}

const TOTAL_AREA = area(OUTER_RADIUS);

function solve(steps) {
  let remainingArea = TOTAL_AREA - 3 * area(INNER_RADIUS);

  function inner(k1, k2, k3, step) {
    if (step > steps) {
      return;
    }
    // (k1+k2+k3+k4)^2 = 2*(k1^2+k2^2+k3^2+k4^2)
    let left = k1 + k2 + k3;
    let right = 2 * (k1 * k1 + k2 * k2 + k3 * k3);
    // (left+k4)^2 = right + 2*k4^2
    // left^2 + 2*left*k4 + k4^2 = right + 2*k4^2
    // left^2 + 2*left*x = right + x^2
    // x^2 - 2*left*x + (right-left^2) = 0
    // A=1, B = 2*left, C = right-left^2

    const B = 2 * left;
    const C = right - left * left;
    const D = B * B - 4 * C;
    if (D < 0) {
      throw 'Error';
    }
    const x1 = (-B + Math.sqrt(D)) / 2;
    const x2 = (-B - Math.sqrt(D)) / 2;
    const k4 = Math.abs(Math.min(x1, x2));
    remainingArea -= area(1 / k4);

    inner(k1, k2, k4, step + 1);
    inner(k2, k3, k4, step + 1);
    inner(k1, k3, k4, step + 1);
  }

  inner(OUTER_K, INNER_K, INNER_K, 1);
  inner(OUTER_K, INNER_K, INNER_K, 1);
  inner(OUTER_K, INNER_K, INNER_K, 1);
  inner(INNER_K, INNER_K, INNER_K, 1);

  return (remainingArea / TOTAL_AREA).toFixed(8);
}

assert.strictEqual(solve(3), '0.06790342');
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(10));
console.log(`Answer is ${answer}`);
