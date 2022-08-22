const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

// https://oeis.org/A002487
// Going up the tree
function solve(left, right) {
  const path = [];
  while (right !== 0) {
    if (left > right) {
      let k = Math.floor(left / right);
      left -= k * right;
      if (left === 0) {
        left += right;
        k--;
      }
      path.push(k);
    } else {
      const k = Math.floor(right / left);
      right -= k * left;
      path.push(k);
    }
  }
  path.reverse();
  return path.join(',');
}

assert.strictEqual(solve(13, 17), '4,3,1');
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(123456789, 987654321, true));
console.log(`Answer is ${answer}`);
