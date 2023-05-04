import assert from 'assert';
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10_000_000;

function getValue(values: number[]): number {
  return values.reduce((a, v) => a + v * v, 0);
}

function* sequence(size: number): IterableIterator<number> {
  let s0 = 290797;
  while (size--) {
    yield (s0 % 64) + 1;
    s0 = s0 * s0;
    s0 %= 50515093;
  }
}

function* sequenceV2(size: number): IterableIterator<number> {
  let s0 = 290797;
  let factor = 1;
  while (size--) {
    yield ((s0 % 64) + 1) * factor;
    s0 = s0 * s0;
    s0 %= 50515093;
    factor = -factor;
  }
}

class Node {
  size: number;
  occupied: boolean;
  next: Node | undefined;
  processed = false;

  constructor(size: number, occupied: boolean) {
    this.size = size;
    this.occupied = occupied;
    this.next = undefined;
  }

  insertAfter(size: number, occupied: boolean): Node {
    const node = new Node(size, occupied);

    node.next = this.next;
    this.next = node;
    return node;
  }

  split(size: number) {
    if (this.processed) {
      throw 'Already processed';
    }

    if (size >= this.size) {
      throw "What's the point?";
    }
    const node = new Node(this.size - size, this.occupied);
    node.next = this.next;
    this.next = node;
    this.size = size;
  }

  getFreeNode(): Node {
    let previous: Node;

    let n = this.next;
    previous = this;
    while (n && n.occupied) {
      previous = n;
      n = n.next;
    }
    if (!n) {
      return previous.insertAfter(this.size, false);
    }
    return n;
  }

  play() {
    if (this.processed || !this.occupied) {
      return;
    }

    // move forward
    const free = this.getFreeNode();
    if (free.size < this.size) {
      this.split(free.size);
    } else if (free.size > this.size) {
      free.split(this.size);
    }

    this.occupied = false;
    free.occupied = true;
    free.processed = true;
  }
}

class Chain {
  root: Node;
  value = 0;

  constructor(values: Iterable<number>) {
    const root = new Node(0, false);

    let current: Node = root;

    for (const size of values) {
      const n = new Node(size, !current.occupied);
      current.next = n;
      current = n;
    }

    this.root = root.next || root;
  }

  findBlockSize(start: Node | undefined = undefined) {
    if (!start) {
      start = this.root;
    }
    let occupied = 0;
    while (start && !start.occupied) {
      start = start.next;
    }
    if (!start) {
      throw 'error';
    }

    let current: Node | undefined = start;
    while (current && occupied >= 0) {
      occupied += current.size * (current.occupied ? 1 : -1);
      current = current.next;
    }
  }

  get done() {
    if (!this.root.occupied) {
      throw 'Error';
    }

    let previous = this.root.size;
    let current: Node | undefined;

    current = this.root;
    while (current) {
      if (current.size < previous) {
        return false;
      }
      if (current.occupied) {
        previous = current.size;
      }
      current = current.next;
    }

    return true;
  }

  step() {
    this.findBlockSize();
    for (let node: Node | undefined = this.root; node; node = node.next) {
      node.play();
    }

    this.finalize();
    // this.dump();
  }

  finalize(): void {
    let root = this.root;

    while (root.next && !root.occupied) {
      root = root.next;
    }

    this.root = root;

    if (!root.occupied) {
      return;
    }

    let current: Node | undefined = root;
    let min = 0;

    while (current && current.next) {
      current.processed = false;
      if (current.occupied === current.next.occupied) {
        current.size += current.next.size;
        current.next = current.next.next;
      } else {
        if (!current.occupied) {
          if (!min || min > current.size) {
            min = current.size;
          }
        }
        current = current.next;
      }
    }

    if (!current.occupied) {
      throw 'error';
    }

    current.processed = false;
    while (this.root.size === 1) {
      this.value += 1;
      const n = root.next?.next;
      if (n) {
        this.root = n;
      } else {
        break;
      }
    }
  }

  valueOf(): number {
    let value = this.value;

    if (this.root.occupied) {
      value += this.root.size ** 2;
    }

    for (let c = this.root.next; c; c = c.next) {
      if (c.occupied) {
        value += c.size ** 2;
      }
    }

    return value;
  }

  dump(onlyKey = false) {
    const values: string[] = [];
    const keys: number[] = [];
    if (this.root.occupied) {
      values.push(`[${this.root.size}]`);
      keys.push(this.root.size);
    } else {
      values.push(`(${this.root.size})`);
    }

    for (let c = this.root.next; c; c = c.next) {
      if (c.occupied) {
        keys.push(c.size);
        values.push(`[${c.size}]`);
      } else {
        values.push(`(${c.size})`);
      }
    }
    if (onlyKey) {
      console.log(this.value, ': ', keys.slice(0, 10).join(','));
    } else {
      console.log(values.join(','), '->', keys.join(','));
    }
  }
}

function solve(length: number, values: Iterable<number> | undefined = undefined): number {
  const chain = new Chain(values ? values : sequence(length + 1));

  while (!chain.done) {
    chain.step();
  }

  const result = chain.valueOf();
  return result;
}

function processBlock(block: number[], sum: number): number[] {
  const newBlock = block.map((v) => -v);
  if (sum < 0) {
    newBlock[newBlock.length - 1] += sum;
    newBlock.push(sum);
  }
  return newBlock;
}

function appendBlock(length: number, chain: Int32Array, block: number[]): number {
  if (length === 0) {
    // remove first negative value
    block.shift();
  } else if (chain[length - 1] < 0) {
    const v = block.shift() || 0;
    chain[length - 1] += v;
  }
  for (const v of block) {
    chain[length++] = v;
  }
  return length;
}

function isDone(chain: Int32Array): boolean {
  if (chain.length === 0) {
    return true;
  }

  let previous = chain[0];
  for (let i = 0; i < chain.length; i++) {
    const v = chain[i];

    if (Math.abs(v) < previous) {
      return false;
    }
    if (v > 0) {
      previous = chain[i];
    }
  }

  return true;
}

function solve2(length: number): number {
  let chain: Int32Array = new Int32Array(sequenceV2(length + 1));
  let newChain = new Int32Array(chain.length);

  let total = 0;

  while (!isDone(chain)) {
    let start = 0;
    while (start < chain.length && chain[start] <= 1) {
      if (chain[start] === 1) {
        total++;
      }
      start++;
    }
    let length = 0;
    let sum = 0;
    let block: number[] = [];
    for (let i = start; i < chain.length; i++) {
      const v = chain[i];
      block.push(v);
      sum += v;
      if (sum <= 0) {
        const newBlock = processBlock(block, sum);
        length = appendBlock(length, newChain, newBlock);
        block = [];
        sum = 0;
      }
    }

    if (block.length) {
      if (sum > 0) {
        // add empty spot at the end
        block.push(-sum);
        sum = 0;
      }
      const newBlock = processBlock(block, sum);
      length = appendBlock(length, newChain, newBlock);
    }

    if (length && newChain[newChain.length - 1] <= 0) {
      length--;
    }

    const old = chain;

    if (length && newChain[0] < 0) {
      chain = newChain.subarray(1, length);
    } else {
      chain = newChain.subarray(0, length);
    }

    newChain = old;
  }

  for (let i = 0; i < chain.length; i++) {
    const v = chain[i] || 0;
    if (v > 0) {
      total += v * v;
    }
  }

  return total;
}

assert.strictEqual(solve(0, [2, 2, 2, 1, 2]), 14);
assert.strictEqual(solve2(10), getValue([1, 3, 10, 24, 51, 75]));
assert.strictEqual(solve2(100), 170376);
console.log('Tests passed');

// const answer1 = TimeLogger.wrap('1', () => solve(2000));
const answer2 = TimeLogger.wrap('2', () => solve2(2000));
console.log(`Answer is ${answer2}`);
