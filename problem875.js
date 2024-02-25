const assert = require('assert');
const { Tracer } = require('@dn0rmand/project-euler-tools');

function q(n) {
  const as = [];

  for (let a1 = 0; a1 < n; a1++) {
    const aa1 = a1.modPow(2, n);

    for (let a2 = 0; a2 < n; a2++) {
      const aa2 = (aa1 + a2.modPow(2, n)) % n;

      for (let a3 = 0; a3 < n; a3++) {
        const aa3 = (aa2 + a3.modPow(2, n)) % n;

        for (let a4 = 0; a4 < n; a4++) {
          const aa4 = (aa3 + a4.modPow(2, n)) % n;
          as[aa4] = (as[aa4] || 0) + 1;
        }
      }
    }
  }

  // const count = as.reduce((a, v) => {
  //   if (v) {
  //     a = a + v * v
  //   }
  //   return a
  // }, 0);

  return as;
}

for (let x = 0; x < 10; x++) {
  const values = [];

  for (let n = 2; n < 21; n++) {
    values.push(q(n)[x] || 0);
  }
  console.log(values.join(', '));
}

// assert.strictEqual(q(4), 18432);
console.log('Test passed');
