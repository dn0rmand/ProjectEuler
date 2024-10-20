const assert = require('assert');
const { TimeLogger, BigMap, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MODULO = 1E9 + 7;
const MODULO_N = BigInt(MODULO);
const MAX = 800;

primeHelper.initialize(MAX);

const limit = [5, 7];

class State {
  constructor(primes, count) {
    this.primes = primes;
    this.count = count;
  }

  get key() {
    const key = this.primes.reduce((a, e, p) => a * (BigInt(p) ** BigInt(e || 0)), 1n);
    return key;
  }

  get value() {
    const sum = this.key.modMul(BigInt(this.count), MODULO_N);
    return Number(sum);
  }

  merge(other) {
    // this.lcms = reduce([...this.lcms, ...other.lcms]);
    this.count += other.count;
  }

  add(number) {
    const primes = [...this.primes];

    primeHelper.factorize(number, (p, e) => {
      primes[p] = Math.max(e, primes[p] || 0);
    });

    const newState = new State(primes, this.count);
    return newState;
  }
}

function G(n, trace) {
  let states = new Map();
  let newStates = new Map();

  states.set(1, new State([], 1));

  const add = state => {
    if (!state) {
      return;
    }
    const key = state.key;
    const old = newStates.get(key);
    if (old) {
      old.merge(state);
    } else {
      newStates.set(key, state);
    }
  };

  const tracer = new Tracer(trace);
  for (let number = 1; number <= n; number++) {
    tracer.print(_ => `${n - number}: ${states.size}`);

    newStates.clear();
    for (const state of states.values()) {
      add(state);
      add(state.add(number));
    }

    [states, newStates] = [newStates, states];
  }

  let answer = 0;
  let size = states.size;
  for (let state of states.values()) {
    tracer.print(_ => `0: ${size}`);
    size--;
    answer = (answer + state.value) % MODULO;
  }

  tracer.clear();
  return answer;
}

assert.strictEqual(G(5), 528);
assert.strictEqual(TimeLogger.wrap('G(20)', _ => G(20)), 8463108648960 % MODULO);

console.log(`Tests passed`);

const answer = TimeLogger.wrap('Solving', _ => G(55, true));
console.log(`Answer is ${answer}`);

/*
class Memoize {
  constructor() {
    this.data = new BigMap();
  }

  clear() {
    this.data.clear();
  }

  get(first, lcm) {
    const index = (BigInt(lcm) * 1000n) + BigInt(first);
    return this.data.get(index);
  }

  set(first, lcm, value) {
    const index = (BigInt(lcm) * 1000n) + BigInt(first);
    this.data.set(index, value);
    return value;
  }
}

function GCD(a, b) {
  while (b != 0) {
    const c = a % b;
    a = b;
    b = c;
  }
  return a;
};

function LCM(a, b) {
  const g = GCD(a, b);
  return ((a / g) * b);
};

const $G = new Memoize();

function G2(n) {
  n = BigInt(n);

  function b(n, m) {
    if (n == 0) {
      return m % MODULO_N;
    } if (n == 1) {
      return (m + m) % MODULO_N;
    } else {
      let v;
      v = $G.get(n, m);
      if (v) {
        return v;
      }
      const m2 = LCM(m, n);
      v = (b(n - 1n, m2) + b(n - 1n, m)) % MODULO_N;

      return $G.set(n, m, v);
    }
  }

  const answer = b(n, 1n);
  return Number(answer);
}

*/