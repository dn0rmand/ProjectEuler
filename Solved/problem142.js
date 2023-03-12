// Perfect Square Collection
// -------------------------
// Problem 142
//
// Find the smallest x + y + z with integers x > y > z > 0 such that x + y, x − y, x + z, x − z, y + z, y − z
// are all perfect squares.

const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX_SQUARE = 1E8;
if (MAX_SQUARE > Number.MAX_SAFE_INTEGER)
  throw "Too big";

const squares = new Map();
const allSquares = [];

function loadSquares() {
  for (let i = 1; ; i++) {
    let s = i * i;
    if (s > MAX_SQUARE)
      break;

    squares.set(s, i);
    allSquares.push(s);
  }
}

function sqrt(value) {
  let r = squares.get(value);
  return r;
}

function solve() {
  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < allSquares.length; i++) {
    process.stdout.write(`\r${i + 1} of ${allSquares.length}`);

    let a2 = allSquares[i];

    for (let j = 0; j < allSquares.length; j++) {
      let b2 = allSquares[j];

      if (((a2 + b2) & 1) !== 0)
        continue;

      let x = (a2 + b2) / 2;
      let y = a2 - x;

      if (y < 2)
        break;

      if (x + y + 1 >= answer)
        break;

      if (x <= y || !sqrt(x + y) || !sqrt(x - y))
        continue;

      for (let c2 of allSquares) {
        if (c2 <= x)
          continue;

        let z = c2 - x;

        if (y <= z)
          break;

        if (x + y + z >= answer)
          break;

        if (sqrt(x + z) && sqrt(x - z) && sqrt(y + z) && sqrt(y - z)) {
          let ans = x + y + z;
          if (ans < answer) {
            console.log(`\rBest so far is ${ans} for x=${x}, y=${y} and z=${z}`);
            answer = ans;
          }
        }
      }
    }
  }

  console.log('');
  if (answer === Number.MAX_SAFE_INTEGER)
    throw "No Answer";

  return answer;
}

loadSquares();

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
