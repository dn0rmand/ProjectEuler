const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function* S() {
  const MODULO = 50515093;

  let current = 290797;
  while (true) {
    yield current;
    current = current.modMul(current, MODULO);
  }
}

function triangle(count) {
  return (count * (count + 1)) / 2;
}

class BowlArray {
  constructor() {
    this.bowls = new Array(100);
    this.$steps = 0;
    this.$extra = 0n;
    this.length = 0;
  }

  getSteps() {
    if (this.$extra) {
      return this.$extra + BigInt(this.$steps);
    } else {
      return this.$steps;
    }
  }

  addSteps(value) {
    const t = this.$steps + value;
    if (t > Number.MAX_SAFE_INTEGER) {
      this.$extra += BigInt(this.$steps) + BigInt(value);
      this.$steps = 0;
    } else {
      this.$steps = t;
    }
  }

  findIndex() {
    return this.bowls.findIndex(({ beans }, index) => {
      return index < this.length - 1 && beans > this.beans(index + 1);
    });
  }

  beans(index) {
    return this.bowls[index].beans;
  }

  push(beans) {
    this.bowls[this.length] = { beans, count: 1 };
    this.length++;
  }

  pop() {
    this.length--;
  }

  get(index) {
    return this.bowls[index];
  }

  processCase1(index, d) {
    const previous = this.get(index - 1);
    const start = this.get(index);
    const end = this.get(index + 1);
    const count = start.count;

    this.addSteps(triangle(count) * d);

    const c = (d * count);
    start.beans -= d;
    end.beans += c;

    if (start.beans === previous.beans) {
      previous.count += start.count;
      this.bowls[index] = end;
      this.bowls.pop();
      this.length--;
      return -1;
    } else if (start.beans === end.beans) {
      start.count += end.count;
      this.pop();
    }
    return 0;
  }

  processCase2(index) {
    const start = this.get(index);
    const end = this.get(index + 1);
    const count = start.count;

    const c = start.beans - end.beans;

    this.addSteps(triangle(count) - triangle(count - c));

    start.beans--;
    if (c === count) {
      end.beans += c;
    } else {
      start.count = c;
      end.beans += c;
      end.count += (count - c);

      const previous = this.get(index - 1);
      if (start.beans === previous.beans) {
        previous.count += c;
        this.bowls[index] = end;
        this.pop();
        return -1;
      }
    }
    return 0;
  }

  sort() {
    let index = this.length - 2;
    if (index < 0) {
      return;
    }

    while (true) {
      if (index >= this.length - 1) {
        break;
      }
      if (index < this.length - 1 && this.beans(index) <= this.beans(index + 1)) {
        break;
      }

      const { beans: a, count } = this.get(index);
      const c = index ? this.beans(index - 1) : 0;
      const b = this.beans(index + 1);
      let d = Math.floor((a - b) / (count + 1));
      if (a - d < c) {
        d = a - c;
      }
      if (d > 0) {
        index += this.processCase1(index, d);
      } else {
        index += this.processCase2(index);
      }
    }
  }

  append(value) {
    if (this.length && this.get(this.length - 1).beans === value) {
      this.get(this.length - 1).count++;
    } else {
      this.push(value);
      this.sort();
    }
  }
}

function B(N) {
  let bowls = new BowlArray();
  let count = 0;

  for (const beans of S()) {
    ++count;
    bowls.append(beans);
    if (count === N) {
      break;
    }
  }
  return bowls.getSteps();
}

// const bowls = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 50];
// assert.strictEqual(B2(bowls, new Tracer(false)), 4764n);

assert.strictEqual(B(5), 0);
assert.strictEqual(B(6), 14263289);
assert.strictEqual(B(10), 31408579);
assert.strictEqual(B(50), 1068449803);
assert.strictEqual(B(100), 3284417556);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => B(1e7));
console.log(`Answer is ${answer}`);