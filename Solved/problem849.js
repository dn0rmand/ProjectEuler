const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1E9 + 7;

// X + (X - 4) + (X - 8) +  ... + (X + 4 - 4J) = J(X + 2 - 2J)

function F(n) {
  n--;
  const X = 4 * n;

  const $f = new Map();

  function f(J, L, S) {

    const get = () => {
      const aj = $f[J];
      if (!aj) { return; }
      const al = aj[L];
      if (!al) { return; }
      return al[S];
    };

    const set = (value) => {
      let aj = $f[J];
      if (!aj) {
        $f[J] = aj = [];
      }
      let al = aj[L];
      if (!al) {
        aj[L] = al = [];
      }
      al[S] = value;
    };

    if (J <= 0) {
      return 0;
    }
    const SJ = S / J;
    if (J > 1 && L <= SJ && SJ <= (X + 2 - 2 * J)) {
      let sum = get();
      if (sum !== undefined) {
        return sum;
      }
      sum = 0;
      for (let i = L; i <= SJ; i++) {
        sum = (sum + f(J - 1, i, S - i)) % MODULO;
      }
      set(sum);
      return sum;
    } if (J === 1 && L <= S && S <= X) {
      return 1;
    } else {
      return 0;
    }
  }

  const result = f(n + 1, 0, 2 * n * (n + 1));
  return result;
}

assert.strictEqual(F(2), 3);
assert.strictEqual(F(3), 13);
assert.strictEqual(F(4), 76);
assert.strictEqual(F(7), 32923);
assert.strictEqual(F(19), 10707285);

console.log('Tests passed');

const answer = TimeLogger.wrap('F(100)', _ => F(100));
console.log(`Answer is ${answer}`);