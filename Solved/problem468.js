const assert = require('assert');

const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 11111111;
const MODULO = 1000000993;

primeHelper.initialize(MAX);

let ids = 0;

class Leaf {
  constructor(prime) {
    this.id = ids++;
    this.value = prime;
    this.inverse = prime.modInv(MODULO);
    this.max = 1;
    this.sum = 0;
  }

  multiply(p, e) {
    const v = p.modPow(e, MODULO);
    this.max = this.max.modMul(v, MODULO);
    this.sum = this.sum.modMul(v, MODULO);
  }

  divise(p, e) {
    const v = this.inverse.modPow(e, MODULO);
    this.max = this.max.modMul(v, MODULO);
    this.sum = this.sum.modMul(v, MODULO);
  }
}

class Node {
  constructor(left, right) {
    this.id = ++ids;
    this.left = left;
    this.right = right;

    left.parent = this;
    right.parent = this;

    this.update();
  }

  update() {
    this.max = this.left.max.modMul(this.right.max, MODULO);
    this.sum = (this.left.max.modMul(this.right.sum, MODULO) + this.left.sum) % MODULO;
  }
}

class NCR {
  constructor(n, primes) {
    this.n = n;
    this.primes = primes;
    this.toUpdate = [];
  }

  addToUpdate(node) {
    if (node && !this.toUpdate.some(f => node.id === f.id)) {
      this.toUpdate.push(node);
    }
  }

  multiply(value) {
    primeHelper.factorize(value, (p, e) => {
      const leaf = this.primes[p];
      leaf.multiply(p, e);
      this.addToUpdate(leaf.parent);
    });
  }

  divise(value) {
    primeHelper.factorize(value, (p, e) => {
      const leaf = this.primes[p];
      leaf.divise(p, e);
      this.addToUpdate(leaf.parent);
    });
  }

  next(r) {
    this.toUpdate = [];

    this.multiply(this.n + 1 - r);
    this.divise(r);

    while (this.toUpdate.length > 0) {
      const nodes = this.toUpdate;
      this.toUpdate = [];
      for (const node of nodes) {
        node.update();
        this.addToUpdate(node.parent);
      }
    }
  }
}

function S(B, n) {
  let max = 1;

  primeHelper.factorize(n, (p, e) => {
    if (p > B) {
      return false;
    }
    max = max * (p ** e);
  });

  return max;
}

function F(n, trace) {
  const primes = [];

  function generateTree() {
    // Generate leaves
    ids = 0;
    let current = new Leaf(1);
    let nodes = [current];

    for (const prime of primeHelper.allPrimes()) {
      if (prime > n) {
        break;
      }

      current.sum = prime - current.value;
      current = new Leaf(prime);
      nodes.push(current);
      primes[prime] = current;
    }
    current.sum = n + 1 - current.value;

    // generate hierarchy
    while (nodes.length > 1) {
      const parents = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1];
        if (right) {
          parents.push(new Node(left, right));
        } else {
          parents.push(left);
        }
      }
      nodes = parents;
    }
    return nodes[0]; // The root
  }

  const nCr = new NCR(n, primes);
  const root = generateTree();

  let total = 2 * root.sum;

  const tracer = new Tracer(trace);
  for (let r = 1, R = n - 1; r <= R; r++, R--) {
    tracer.print(_ => R - r);
    nCr.next(r);
    const subTotal = root.sum;
    total = (total + subTotal) % MODULO;
    if (r !== R) {
      total = (total + subTotal) % MODULO;
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(S(1, 10), 1);
assert.strictEqual(S(4, 2100), 12);
assert.strictEqual(S(17, 2496144), 5712);

assert.strictEqual(F(11), 3132);
assert.strictEqual(F(1111), 706036312);
assert.strictEqual(F(2222), 896362905);
assert.strictEqual(TimeLogger.wrap('F(11111)', _ => F(11111)), 283412918);
assert.strictEqual(TimeLogger.wrap('F(111111)', _ => F(111111, true)), 22156169);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => F(MAX, true));
console.log(`Answer is ${answer}`);
