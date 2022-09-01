const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007;
const MAX = 600;

const compareArray = (a1, a2) => {
  let c = a1.length - a2.length;
  if (c === 0) {
    for (let i = 0; i < a1.length; i++) {
      c = a1[i] - a2[i];
      if (c !== 0) {
        break;
      }
    }
  }
  return c;
};

class Trio {
  static makeTrio(count) {
    const trios = [];
    for (let i = 0; i < count; i += 3) {
      trios.push([]);
    }
    return new Trio(trios, 1);
  }

  constructor(trios, count) {
    this.trios = trios;
    this.count = count;
  }

  allowed(g1, trio) {
    return trio.length < 3 && !trio.includes(g1);
  }

  getKey(currentGroup) {
    let $map = [];
    let $next = 0;
    const map = (v) => {
      if (v < currentGroup) {
        return 0;
      }
      if (!$map[v]) {
        $map[v] = ++$next;
      }
      return $map[v];
    };

    const trios = this.trios.map((t) => {
      const q = t.map(map);
      //   q.sort((a, b) => a - b);
      return q;
    });

    trios.sort((t1, t2) => compareArray(t2, t1));

    let s = [];
    for (const q of trios) {
      if (q.length === 0) {
        continue;
      }
      if (q.length === 3 && q[2] === 0) {
        continue;
      }
      const k = q.join(':');
      s.push(k);
    }
    return s.join(',');
  }

  add(group, callback) {
    this.trios.sort((t1, t2) => compareArray(t1, t2));

    for (let i = 0; i < this.trios.length; i++) {
      const trio = this.trios[i];
      if (trio.length >= 3) {
        break;
      }
      if (!this.allowed(group, trio)) {
        continue;
      }
      let count = 1;
      for (let k = i + 1; k < this.trios.length; k++) {
        const trio2 = this.trios[k];
        if (compareArray(trio, trio2) === 0) {
          count++;
        } else {
          break;
        }
      }
      i += count - 1;
      const newTrios = [...this.trios];
      newTrios[i] = [...trio, group];
      callback(new Trio(newTrios, this.count.modMul(count, MODULO)));
    }
  }
}

function factorial(n) {
  n = n / 3;
  let v = 1;
  for (let i = 2; i <= n; i++) {
    v = v.modMul(i, MODULO);
  }
  return v;
}

function F(n, trace) {
  assert.strictEqual(n % 12, 0);

  let trios = new Map();
  let newTrios = new Map();
  trios.set(0, Trio.makeTrio(n));

  const tracer = new Tracer(trace);

  // Make Trios
  for (let person = 0; person < n; person += 1) {
    tracer.print((_) => `${n - person}: ${trios.size}`);
    const group = Math.floor(person / 4) + 1;
    newTrios.clear();

    for (const trio of trios.values()) {
      trio.add(group, (newTrio) => {
        const k = newTrio.getKey(group);
        const o = newTrios.get(k);
        if (o) {
          o.count = (o.count + newTrio.count) % MODULO;
        } else {
          newTrios.set(k, newTrio);
        }
      });
    }

    [trios, newTrios] = [newTrios, trios];
  }

  tracer.clear();

  let total = 0;
  trios.forEach((t) => {
    total = (total + t.count) % MODULO;
  });

  total = total.modDiv(factorial(n), MODULO);
  return total;
}

assert.strictEqual(F(12), 576);
assert.strictEqual(F(24), 509089824);
assert.strictEqual(F(36), 54579765);
console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => F(MAX, true));

console.log(`Answer is ${answer}`);
