const sudokus = require('./problem96+data.js');
const {
  sudoku: { grid: Grid, solver: sudokuSolver },
} = require('@dn0rmand/project-euler-tools');

function SolveSudoku(sudoku, allowBruteForce) {
  let grid = Grid(sudoku);
  let solver = sudokuSolver(grid, allowBruteForce);

  let canStop = () => {
    let c1 = grid.get(0, 0).value;
    let c2 = grid.get(1, 0).value;
    let c3 = grid.get(2, 0).value;

    return c1 !== 0 && c2 !== 0 && c3 !== 0;
  };

  if (solver.solve(canStop)) {
    let c1 = grid.get(0, 0).value;
    let c2 = grid.get(1, 0).value;
    let c3 = grid.get(2, 0).value;

    let value = c1 * 100 + c2 * 10 + c3;
    if (solver.usedBruteForce) return -value;
    else return value;
  } else {
    return 0;
  }
}

let sum = 0;
let failed = 0;
let brute = 0;
for (let i = 0; i < sudokus.length; i++) {
  let sudoku = sudokus[i];
  let v = SolveSudoku(sudoku, true);
  if (v === 0) {
    failed++;
  } else if (v < 0) {
    sum -= v;
    brute++;
  } else {
    sum += v;
  }
}

if (failed > 0) {
  console.log(failed + " grid couldn't be solved");
} else if (brute > 0) {
  console.log(
    'Solved all but ' +
      brute +
      ' grid' +
      (brute > 1 ? 's' : '') +
      ' required brute force ... Sum is ' +
      sum +
      ' (24702)'
  );
} else {
  console.log('Solved all ... Sum is ' + sum + ' (24702)');
}
