const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 70;
primeHelper.initialize(1e10);
const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

const sequenceValues = [
  3n,
  6n,
  21n,
  36n,
  91n,
  136n,
  9316n,
  154846n,
  700336n,
  1439056n,
  369335431n,
  577099351n,
  901701811n,
  1408928986n,
  1449830476n,
  23928296941n,
  37387861426n,
  168829016986n,
  460093231216n,
  110767449875176n,
  114071019205006n,
  515101916006866n,
  624856021577011n,
  625364653009726n,
  636095211562531n,
  791034520439296n,
  10089725782489606n,
  11481597605023021n,
  17939996328881026n,
  81010296299963836n,
  92981677420376641n,
  95796967024257346n,
  432583178346902836n,
  695050354369089181n,
  1086016178149033726n,
  4904041801518181036n,
  5017313035276563736n,
  5158638885627738946n,
  23294478724311768436n,
  25569774643895944561n,
  39952772884439534701n,
  62426207636126924626n,
  62432255713424708566n,
  73925039892279089836n,
  81354448112662544716n,
  96237036897823074331n,
  103330530739817548336n,
  103434720832485609841n,
  103955851749200658481n,
  113496489003578620591n,
  177338264075153916301n,
  277091037608600092186n,
  331923871659605356846n,
  334243075730831721091n,
  522254805841544141926n,
  522317883458080662436n,
  571222738698982646851n,
  892535529233004173686n,
  2824244497836308469196n,
  46611066419969867473141n,
  52546386651010879803751n,
  82103729142356459141311n,
  128287076784742018098361n,
  200448557476396839916111n,
  313200871057166858165701n,
  489376361026452221137936n,
  923141070133268492639386n,
  4168558894823247480910921n,
  4173630053778408183884776n,
  // last index is 6795261671274
];

function isTriangle(n) {
  const v = 8n * n + 1n;
  const s = v.sqrt();
  return s * s === v;
}

function triangle(x) {
  return (x * (x + 1n)) / 2n;
}

function reverseTriangle(x) {
  const v = (x + x).sqrt();
  let t = triangle(v - 1n);
  let r = v;
  while (t <= x) {
    t += r;
    if (t > x) {
      break;
    }
    r++;
  }

  return r - 1n;
}

function factorize(n, max) {
  const primes = [];
  const N = n;

  for (const p of allPrimes) {
    if (p > n || p > max) {
      break;
    }
    if (n % p === 0n) {
      let e = 0n;
      while (n % p === 0n) {
        n /= p;
        e++;
      }
      primes.push({ prime: p, power: e });
      if (n === 1n) {
        break;
      }
    }
  }

  if (n > 1n) {
    allPrimes.push(n);
    allPrimes.sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));
    return factorize(N, max);
  }
  return primes;
}

function findSize(x, m) {
  const xx = x + x;
  factorize(m);

  const primes = factorize(xx, m);

  function check(x, y) {
    if (y >= m) {
      return false;
    }
    let last = xx / y + y - 1n;
    if (last & 1n) {
      return false;
    }
    last /= 2n;
    const first = last - y;
    if (first < 1n) {
      return false;
    }
    const t = triangle(last) - triangle(first);
    return t === x;
  }

  const max = xx / (m - 1n);
  for (let d = max; d; d--) {
    if (xx % d === 0n) {
      let h = xx / d;
      let l = d;
      if (h > d && h < m) {
        throw 'error';
      }
      if (check(x, l)) {
        return l;
      }
    }
  }
  return 1n;
}

function consecutiveSum(x, m) {
  m ??= reverseTriangle(x);
  const y = findSize(x, m);
  const last = ((x + x) / y + y - 1n) / 2n;
  return last;
}

function consecutiveSum1(x, m) {
  m ??= reverseTriangle(x);
  let expect = reverseTriangle(m);
  let t = triangle(expect - 1n);
  for (let k = expect, y = m - expect; y > 0; y--, k++) {
    t += k;
    if (y > 1n && t < y) {
      continue;
    }
    const mod = t % y;
    if (mod === 0n) {
      const last = ((x + x) / y + y - 1n) / 2n;
      return last;
    }
  }
  throw 'Error';
}

function* sequence() {
  let a, m;
  for (a of sequenceValues) {
    yield a;
  }

  while (true) {
    m = consecutiveSum(a, m);
    a = triangle(m);
    yield a;
  }
}

function* sequence0() {
  let previous = 2n;
  let current = triangle(previous);
  let lastGap = 1n;
  while (true) {
    yield current;
    // current = t(next) - t(gap)
    const A = current + current;
    let next = 0n;
    let gap;
    for (gap = 1n; ; gap++) {
      const x = A + gap * gap + gap;
      const s = x.sqrt();
      let v = s * (s + 1n);
      if (v === x) {
        next = s;
        break;
      }
    }

    current = triangle(next);
    lastGap = gap;
  }
}

function solve(index, trace) {
  const tracer = new Tracer(trace);
  const values = [];
  for (const a of sequence()) {
    values.push(a);
    tracer.print(() => index - values.length);
    if (values.length === index) {
      tracer.clear();
      break;
    }
  }

  let idx = 0n;
  for (let i = 1; i < values.length; i++) {
    const gap = values[i] - values[i - 1];
    // x ** 2 + 3*x + 2 - 2*gap = 0; A =1, B = 3, C = 2-2*gap
    // DELTA = b^2 - 4ac = 1 + 8*gap
    const delta = 1n + 8n * gap;
    const s = delta.sqrt();
    const x = (s - 3n) / 2n;
    idx += x + 1n;
  }
  return { value: values[index - 1], index: idx };
}

assert.deepStrictEqual(solve(10), { value: 1439056n, index: 2964n });
assert.deepStrictEqual(
  TimeLogger.wrap('', () => solve(37, true)),
  { value: 5017313035276563736n, index: 6642105951n }
);

console.log(`Tests passed`);

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer.index}`);
