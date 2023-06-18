const assert = require('assert');
const { TimeLogger, Tracer, primeHelper, divisors, announce } = require('@dn0rmand/project-euler-tools');

const MAX = 1e6;

primeHelper.initialize(MAX);

let $N;

let squares = new Set();
let beads = [];
let beadMap;
let connections = [];

function getSquares(n) {
  const squares = new Set();
  const max = n * n - 1;

  for (let i = 1; ; i++) {
    const v = i * i + 1;
    if (v > max) {
      break;
    }
    squares.add(v);
  }
  return squares;
}

function getBeads(N) {
  const beads = [1, 2];
  beadMap[1] = true;
  beadMap[2] = true;

  for (let p of primeHelper.allPrimes()) {
    if (p > N) {
      break;
    }
    if (p === 2) {
      continue;
    }

    let v2 = 2 * p;
    let v3 = p;
    while (v2 <= N && v3 <= N) {
      beadMap[v2] = true;
      beadMap[v3] = true;
      beads.push(v2);
      beads.push(v3);
      v2 *= p;
      v3 *= p;
    }
    while (v3 <= N) {
      beadMap[v3] = true;
      beads.push(v3);
      v3 *= p;
    }
  }

  beads.sort((a, b) => a - b);

  return beads;
}

function cleanUp(bad) {
  if (!bad || bad.length === 0) {
    bad = beads.filter(bead => connections[bead].length < 2);
  }

  while (bad.length > 0) {
    if (bad.length > 0) {
      done = false;
      beads = beads.filter(bead => !bad.includes(bead));
      connections = connections.map((v, index) => bad.includes(index) ? [] : connections[index])
      beads.forEach(bead => {
        connections[bead] = connections[bead].filter(b => !bad.includes(b));
      });
    }

    bad = beads.filter(bead => connections[bead].length < 2);
  }
}

function prepare(N, trace) {
  $N = BigInt(N + 1);
  beadMap = new Uint32Array(N + 1);
  beads = getBeads(N);
  squares = getSquares(N);
  connections = [];

  for (const bead of beads) {
    connections[bead] = [];
  }

  const tracer = new Tracer(trace, 'Preparing');
  let size = squares.size;
  for (const square of squares.values()) {
    tracer.print(_ => size);
    size--;

    for (const b1 of divisors(square)) {
      const b2 = square / b1;
      if (b1 !== b2 && beadMap[b1] && beadMap[b2]) {
        connections[b1].push(b2);
      }
    }
  }

  cleanUp();

  tracer.clear();
}

function F(N, trace) {
  prepare(N, trace);

  let total = 0;

  const used = new Uint8Array(N + 1);

  function inner(first, last, sum, length) {
    if (length && first === last) {
      if (length >= 3) {
        total += sum;
      }
    } else {
      for (const next of connections[last]) {
        if (!used[next]) {
          used[next] = 1;
          inner(first, next, sum + next, length + 1);
          used[next] = 0;
        }
      }
    }
  }

  const tracer = new Tracer(trace, 'Solving');

  let step = 0;
  while (beads.length) {
    step++;
    tracer.print(_ => `${step} - ${beads.length}`);
    const bead = beads[0];
    inner(bead, bead, 0, 0);
    cleanUp([bead]);
  }
  tracer.clear();
  total /= 2;
  return total;
}

async function solve() {
  assert.strictEqual(F(20), 258);
  assert.strictEqual(TimeLogger.wrap('F(100)', _ => F(100)), 538768);

  console.log('Tests passed');

  const answer = TimeLogger.wrap('', _ => F(MAX, true));
  console.log(`Answer is ${answer}`);
  await announce(846, `Answer is ${answer}`);
}

solve();