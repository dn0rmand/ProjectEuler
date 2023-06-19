const assert = require('assert');
const { TimeLogger, Tracer, linearRecurrence, matrix: Matrix } = require('@dn0rmand/project-euler-tools');

const MODULO = 100000007n;
const MAX = 10n ** 10000n;

const $a = [
  1n,
  229n,
  117805n,
  64647289n,
  35669566217n,
  19690797527709n,
  10870506600976757n,
  6001202979497804657n,
  3313042830624031354513n,
  1829008840116358153050197n,
  1009728374600381843221483965n,
  557433823481589253332775648233n,
  307738670509229621147710358375321n,
  169891178715542584369273129260748045n,
  93790658670253542024618689133882565125n,
  51778366130057389441239986148841747669217n,
  28584927722109981792301610403923348017948449n,
  15780685138381102545287108197623881881376915397n,
  8711934690116480171969789787256390490181022415693n,
  4809538076408327645969201260680362259835079086427481n,
  2655168723276120197512956906659822833388644760430125609n,
  1465820799640802552047402979496052449322258430218930512765n,
  809225642733724788155919446555896648357335949987871250500245n,
  446743654489197568088617503727278115945835626935048667406598225n,
];

function a(n) {
  if ($a[n] !== undefined) {
    return $a[n];
  }

  let r = 0n
    + 679n * a(n - 1)
    - 76177n * a(n - 2)
    + 3519127n * a(n - 3)
    - 85911555n * a(n - 4)
    + 1235863045n * a(n - 5)
    - 11123194131n * a(n - 6)
    + 65256474997n * a(n - 7)
    - 257866595482n * a(n - 8)
    + 705239311926n * a(n - 9)
    - 1363115167354n * a(n - 10)
    + 1888426032982n * a(n - 11)
    - 1888426032982n * a(n - 12)
    + 1363115167354n * a(n - 13)
    - 705239311926n * a(n - 14)
    + 257866595482n * a(n - 15)
    - 65256474997n * a(n - 16)
    + 11123194131n * a(n - 17)
    - 1235863045n * a(n - 18)
    + 85911555n * a(n - 19)
    - 3519127n * a(n - 20)
    + 76177n * a(n - 21)
    - 679n * a(n - 22)
    + a(n - 23);

  $a[n] = r;
  return r;
}

let $config;

function configure() {
  if ($config) {
    return $config;
  }

  const data = [];
  for (let i = 1; i <= 100; i++) {
    data.push(a(i));
  }

  const ln = linearRecurrence(data, true);
  if (ln.divisor !== 1n) { throw "Error"; }
  const matrix = Matrix.fromRecurrence(ln.factors);
  const values = new Matrix(matrix.rows, 1);

  for (let r = 1; r <= matrix.rows; r++) {
    values.set(matrix.rows - r, 0, data[r - 1]);
  }

  $config = { matrix, values };
  return $config;
}

function f(n) {
  n = BigInt(n);
  if (n & 1n) { throw "Error: Even number only please"; }

  const { matrix, values } = configure();
  const power = (n / 2n) - 1n;

  if (power) {
    const m = matrix.pow(power, MODULO);
    const i = m.multiply(values, MODULO);

    return i.get(matrix.rows - 1, 0);
  } else {
    return values.get(values.rows - 1, 0);
  }
}

assert.strictEqual(f(2), 229n);
assert.strictEqual(f(4), 117805n);
assert.strictEqual(f(10), 96149360n);
assert.strictEqual(f(1e3), 24806056n);
assert.strictEqual(f(1e6), 30808124n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => f(MAX));
console.log(`Answer is ${answer}`);