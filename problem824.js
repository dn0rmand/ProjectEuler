const assert = require('assert');
const {
  TimeLogger,
  binomial: _binomial,
  Tracer,
  linearRecurrence,
  polynomial,
} = require('@dn0rmand/project-euler-tools');

const MODULO = (1e7 + 19) ** 2;

let $R = [];
let $RN = undefined;

const USE_MODULO = true;

const ONE = USE_MODULO ? 1 : 1n;
const ZERO = USE_MODULO ? 0 : 0n;

function binomial(n, p) {
  if (USE_MODULO) {
    return _binomial(n, p, MODULO);
  } else {
    return _binomial(BigInt(n), BigInt(p));
  }
}

function modMul(...values) {
  let t = ONE;
  if (USE_MODULO) {
    for (const v of values) {
      t = t.modMul(v, MODULO);
    }
  } else {
    for (const v of values) {
      t = t * BigInt(v);
    }
  }
  return t;
}

function modPow(a, b) {
  if (USE_MODULO) {
    return a.modPow(b, MODULO);
  } else {
    return BigInt(a) ** BigInt(b);
  }
}

function plus(a, b) {
  if (USE_MODULO) {
    return (a + b) % MODULO;
  } else {
    return BigInt(a) + BigInt(b);
  }
}

function R(N, K) {
  if (2 * K > N) {
    return ZERO;
  }
  if (K === 0) {
    return ONE;
  }
  if (K === 1) {
    return N;
  }

  if ($RN !== N) {
    $RN = N;
    $R = [];
  }

  if ($R[K] !== undefined) {
    return $R[K];
  }
  const count = binomial(N - K, N - 2 * K) + binomial(N - K - 1, N - 2 * K);
  $R[K] = count;
  return count;
}

function getMaxK(N) {
  let K = Math.round(N / 2);
  if (R(N, K) === 0) {
    while (K > 0 && R(N, K) === 0) {
      K--;
    }
    return K;
  } else {
    return K;
  }
}

class Memoizer {
  constructor(N) {
    this.maxK = Math.floor(N / 2);
    this.N = N;
    this.data = new Array(N);
  }

  getMap(remaining, nextK) {
    let a = this.data[remaining];
    if (!a) {
      a = new Array(this.maxK);
      this.data[remaining] = a;
    }
    let b = a[nextK];
    if (!b) {
      b = [];
      a[nextK] = b;
    }
    return b;
  }

  get(remaining, unused, nextK) {
    const m = this.getMap(remaining, nextK);
    return m[unused];
  }

  set(remaining, unused, nextK, value) {
    const m = this.getMap(remaining, nextK);
    m[unused] = value;
  }
}

function L(N, K, trace) {
  const MAX_K = getMaxK(N, K);
  const memoize = new Memoizer(N, K);

  function inner(unused, remaining, nextK) {
    if (remaining <= 0 || unused <= 0) {
      if (remaining >= 0 && unused === 0) {
        return 1;
      }
      return 0;
    }
    if (remaining * nextK < unused) {
      // Won't be able to do it
      return false;
    }

    let total = memoize.get(remaining, unused, nextK);
    if (total !== undefined) {
      return total;
    }
    total = 0;
    for (let k = nextK; k > 1; k--) {
      const maxRows = Math.floor(unused / k);
      for (let rows = maxRows; rows >= 1; rows--) {
        const res = inner(unused - rows * k, remaining - rows, k - 1);
        if (res === false) {
          break;
        } else if (res > 0) {
          const count = modPow(R(N, k), rows);
          const b = binomial(remaining, rows);
          const t = modMul(b, count, res);
          total = plus(total, t);
        }
      }
    }
    // Do k=1 differently to short-cut
    const res = inner(0, remaining - unused, 0);
    if (res !== false && res > 0) {
      const count = modPow(R(N, 1), unused);
      const b = binomial(remaining, unused);
      const t = modMul(b, count, res);
      total = plus(total, t);
    }
    memoize.set(remaining, unused, nextK, total);
    return total;
  }

  function outer() {
    const tracer = new Tracer(trace, `solving L(${N}, ${K})`);
    const maxRows = Math.floor(K / MAX_K);

    let total = 0;
    for (let rows = maxRows; rows >= 1; rows--) {
      tracer.print((_) => rows);
      const res = inner(K - rows * MAX_K, N - rows, MAX_K - 1);
      if (K === rows * MAX_K && res == 0) {
        tracer.clear();
        return res;
      }
      if (res === false) {
        break;
      } else if (res) {
        const count = modPow(R(N, MAX_K), rows);
        const b = binomial(N, rows);
        const t = modMul(b, count, res);
        total = plus(total, t);
      }
    }
    tracer.print((_) => 0);
    const res = inner(K, N, MAX_K - 1);
    if (res) {
      total = plus(total, res);
    }
    tracer.clear();
    return total;
  }

  const total = outer();
  return BigInt(total);
}

function getMax(n) {
  let previous = 0;
  let previousK = 0;

  for (let k = n; ; k++) {
    const v = L(n, k, true);
    if (v < previous) {
      return k;
    }
    previous = v;
    previousK = k;
  }

  return previousK;
}

function analyze() {
  const values = [];
  for (let n = 10; n < 25; n++) {
    values.push(getMax(n));
  }
  console.log(values.join(', '));
  //   start = getFirstN(1e15, 1000000);
  //   console.log(1000, start);

  //   const values = [];

  //   for (let n = start; values.length < 50; n++) {
  //     values.push(L(n, 100, true));
  //   }

  //   try {
  //     const l = linearRecurrence(values);
  //     if (l && l.divisor === 1n) {
  //       console.log(l);
  //     }
  //   } catch (e) {
  //     console.log('No recurrence');
  //   }
  //   try {
  //     const p = polynomial.findPolynomial(0, 1, (x) => values[x]);
  //     if (p) {
  //       console.log(p);
  //     }
  //   } catch (e) {
  //     console.log('No polynomial');
  //   }

  process.exit(0);
}

//analyze();

assert.strictEqual(L(6, 12), 4204761n);
assert.strictEqual(L(2, 2), 4n);
assert.strictEqual(
  TimeLogger.wrap('', (_) => L(20, 60)),
  38762707948572n
);
console.log('Tests passed');

// const answer = TimeLogger.wrap('', (_) => L(100, 1000, true));
// console.log(`Answer is ${answer}`);
// R(n, k) => binomial(n+1, n-1) + binomial(n, n-1)
