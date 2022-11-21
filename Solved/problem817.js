const assert = require('assert');
const { BigSet, Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const P = 10 ** 9 + 7;

function solve() {
  let total = 0n;
  const MAX = 10 ** 5;
  const tracer = new Tracer(true);
  const visited = new BigSet();
  const BASE = BigInt(P);
  const BASE2 = BASE * BASE;

  const set = (d, value) => {
    if (d < P - MAX) {
      return;
    }
    if (!visited.has(d)) {
      total += value;
      visited.add(d);
    }
  };

  const check = (n) => {
    let value = (n * n) % BASE2;
    const d1 = value % BASE;
    const d2 = ((value - d1) / BASE) % BASE;
    set(d1, n);
    set(d2, n);
  };

  for (let a = 1n; ; a++) {
    tracer.print((_) => `${13416407867n - a}: ${MAX - visited.size}`);
    check(a);
    if (visited.size === MAX) {
      break;
    }
  }
  if (visited.size !== MAX) {
    throw 'WHAT!!!';
  }
  tracer.clear();

  return total;
}

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
