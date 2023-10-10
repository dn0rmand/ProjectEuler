const assert = require('assert');
const { TimeLogger, BigMap, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MODULO = 1E9 + 7;
const MODULO_N = BigInt(MODULO);
const MAX = 800;

primeHelper.initialize(MAX);

class State {
  constructor(primes, lcms) {
    this.primes = primes;
    this.lcms = lcms;
  }

  get key() {
    const key = this.primes.reduce((a, p) => a * BigInt(p), 1n);
    return key;
  }

  get value() {
    const sum = this.lcms.reduce((a, { lcm, count }) => a = (a + lcm.modMul(count, MODULO_N)) % MODULO_N, 0n);
    return Number(sum);
  }

  reduce(lcms) {
    lcms.sort((a, b) => a.lcm < b.lcm ? -1 : (a.lcm > b.lcm ? 1 : 0));
    for (let i = 0, j = 1; j < lcms.length; j++) {
      const { lcm, count } = lcms[j];
      if (lcm === lcms[i].lcm) {
        lcms[i].count += count;
      } else {
        i++;
        lcms[i] = { lcm, count };
      }
    }
    lcms.length = i + 1;
    return lcms;
  }

  merge(other) {
    this.lcms = reduce([...this.lcms, ...other.lcms]);
  }

  add(number) {
    const primes = [];

    let skip = false;
    primeHelper.factorize(number, (p, e) => {
      if (this.primes.includes(p)) {
        skip = true;
        return false;
      }
      primes.push(p);
    });
    if (skip) {
      return;
    }

    let lcms = [...this.lcms];
    for (let n = number - 1; n > 1; n--) {
      const add = primes.some(p => n % p === 0);
      if (add) {
        lcms.push({ lcm: n, count: 1 });
        for (const { lcm, count } of this.lcms) {

        }
      }
    }
    const newState = new State(primes, this.count);
    return newState;
  }
}

function G(n) {
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

  for (let number = 1; number <= n; number++) {
    newStates.clear();
    for (const state of states.values()) {
      add(state);
      add(state.add(number));
    }

    [states, newStates] = [newStates, states];
  }

  let answer = 0;

  for (let state of states.values()) {
    answer = (answer + state.value) % MODULO;
  }

  return answer;
}

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

const values = [
  1n,
  2n,
  6n,
  24n,
  88n,
  528n,
  1392n,
  11136n,
  41856n,
  192192n,
  516032n,
  6192384n,
  13270272n,
  185783808n,
  511526400n,
  1163742720n,
  4403449344n,
  79262088192n,
  199280729088n,
  3985614581760n,
  8463108648960n,
  19276630732800n,
  54618972549120n,
  1310855341178880n,
  2751134770298880n,
  17228042511482880n,
  49223303983595520n,
  226579920553082880n,
  481029202137415680n,
  14430876064122470400n,
  28985831003883110400n,
  927546592124259532800n,
  3511834274207681740800n,
  8057033930769511219200n,
  23275880819669414707200n,
  47971545335477777203200n,
  98048634222489580339200n,
  3725848100454604052889600n,
  10804959935705216817561600n,
  24851731557674120569159680n,
  50044440897208452152033280n,
  2101866517682754990385397760n,
  4261537686760785274302627840n,
  187507658217474552069315624960n,
  399072786772833140020535623680n,
  807055085208417821843238420480n,
  2353910670183570948155768832000n,
  112987712168811405511476903936000n,
  236956412060640581770460056780800n,
  1918155241902498858728551769702400n,
  5116721671637057154371123832422400n,
  11807828065394609705148718094745600n,
  25156070103006491119320676958208000n,
  1358427785562350520443316555743232000n,
  3417515176154675803740266947411968000n,
  7041604283261050954641289563340800000n,
  14114301065924705207581678020801331200n,
  32608907184279075723135505471950028800n,
  95652794409444663488145737353820897280n,
  5739167664566679809288744241229253836800n,
  11478904233324583380655633539789540556800n
].map(v => v % MODULO_N);

assert.strictEqual(G(5), 528);
assert.strictEqual(TimeLogger.wrap('G(20)', _ => G(20)), 8463108648960 % MODULO);

console.log(`Tests passed`);

const answer = TimeLogger.wrap('Solving', _ => G(60));
console.log(`Answer is ${answer}`);