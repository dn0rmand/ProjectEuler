const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 13 ** 8;

function getRepeatSize() {
  /*    
  const tracer = new Tracer(true);

  const MAX = 29000000;

  let current = 8n;
  let first = current;

  for (let n = 1; n < MAX; n++) {
    tracer.print((_) => MAX - n);
    current = (3 * current).modPow(3, MODULO);

    if (current === first) {
      tracer.clear();
      return n;
    }
  }

  throw 'No repeat';
  */

  return 28960854;
}

function loadIndexes(size) {
  const tracer = new Tracer(true);

  const values = new Array(size);
  const MOD = BigInt(MODULO.lcm(size));
  let value = 8n;
  for (let n = 0; n < size; n++) {
    tracer.print((_) => size - n);
    values[n] = Number(value);
    value = (3n * value) ** 3n % MOD;
  }
  tracer.clear();

  return values;
}

const answer = TimeLogger.wrap('Solving', () => {
  const repeatSize = getRepeatSize();
  const values = loadIndexes(repeatSize);

  function C(n, indexing) {
    n -= 3;
    if (n < 0) {
      n += repeatSize;
    }
    if (indexing) {
      return values[n % repeatSize] % repeatSize;
    } else {
      return values[n % repeatSize] % MODULO;
    }
  }

  //assert.strictEqual(C(5), 493611087);
  //assert.strictEqual(C(10000), 617720485);

  return C(C(C(10000, true), true), false);
});

console.log(`Answer is ${answer}`);
