const assert = require('assert');
const { primeHelper, TimeLogger, BigSet, Tracer } = require('@dn0rmand/project-euler-tools');

const TEST = true;

const MAX_X = TEST ? 123567101 : 123567101113;
const SECTION = TEST ? 1e7 : 1e9;
const MAX_PRIME = TEST ? MAX_X : 4e7;

const extraPrimes = [
  44560482149, 1232221121, 1027313297,
  767122541, 533864129, 519145421, 503289337, 481927261, 463932457, 443128993, 362731069, 351205537,
  347483377, 316062277, 303648049, 274407241, 272374121, 252880889, 230762593, 225366389, 219222473,
  207403201, 194306897, 192837509, 192214417, 180477433, 179108597, 176915381, 172566929, 172386853,
  171739241, 170937553, 170151073, 167365189, 164654561, 164013413, 163463309, 150859301, 148510573,
  138312277, 137763397, 136083889, 135913553, 134803873, 126823093, 126619981, 118462781, 116169649,
  114954761, 113806081, 112503961, 109407901, 109324169, 107482873, 104667889, 104573297, 100030001,

  97047089, 96365089, 95847137, 95499101, 89902949, 89292277, 86995957, 86176529, 85846469, 84831821,
  84443693, 83716609, 81650953, 80450261, 80115881, 79120793, 77766701, 76934989, 74263781, 72899413,
  72175861, 71933429, 71887273, 70917097, 70035353, 69294649, 69147173, 69099881, 67130597, 66961289,
  66943189, 66502253, 66329353, 65906677, 65634301, 65472821, 65231953, 65180113, 65100949, 64802401,
  63792149, 63749573, 61957849, 61319501, 60370441, 60237913, 59679101, 59429417, 58072081, 57050437,
  55942157, 55388849, 55335641, 53777489, 52836073, 51526121, 50918017, 50315269, 49752877, 49497377,
  47733277, 47317177, 47293501, 46336217, 45564853, 45133021, 44075293, 44060161, 43627721, 43572829,
  43079461, 43060469, 42643969, 42592577, 42534841, 42333341, 42187381, 42151729, 41920577, 41805077,
  41256157, 41207321, 41162357, 40979201, 40935341, 40921757, 40826521, 40694669, 40637717, 40477141,
  40301477, 40058197
].reverse();

const allPrimes = TimeLogger.wrap('Loading 4k+1 primes', _ => {
  primeHelper.initialize(MAX_PRIME, true);
  const allPrimes = primeHelper.allPrimes().filter(p => (p % 4) === 1);
  allPrimes.push(...extraPrimes);
  primeHelper.reset();
  return allPrimes;
});

function TonelliShanks(n, p) {
  const p1 = p - 1;
  const p12 = p1 / 2;
  const p14 = (p + 1) / 4;
  let q = p1;
  let s = 0;
  while (q % 2 === 0) {
    q /= 2;
    s += 1;
  }
  if (s === 1) {
    return n.modPow(p14, p);
  }

  let z = 2;
  for (; z < p; z++) {
    if (p1 === z.modPow(p12, p)) {
      break;
    }
  }

  let c = z.modPow(q, p);
  let r = n.modPow((q + 1) / 2, p);
  let t = n.modPow(q, p);
  let m = s;

  while ((t - 1) % p) {
    let t2 = t.modMul(t, p);
    let i = 1;
    for (; i < m; i++) {
      if ((t2 - 1) % p === 0) {
        break;
      }
      t2 = t2.modMul(t2, p);
    }
    const pow = 1 << (m - i - 1);
    b = c.modPow(pow, p);
    r = r.modMul(b, p);
    c = b.modMul(b, p);
    t = t.modMul(c, p);
    m = i;
  }
  return r;
}

function Hensel(v, p, max) {
  let p2 = p * p;
  let x1, x2;

  const f1 = (v + v).modInv(p);

  if (p2 > Number.MAX_SAFE_INTEGER) {
    p = BigInt(p);
    v = BigInt(v);
    p2 = p * p;

    const F = v.modMul(v, p2) + 1n;

    x1 = (v + p2 - F.modMul(f1, p2)) % p2;
    x2 = Number(p2 - x1);
    x1 = Number(x1);
    return { p: Number(p), x1: Math.min(x1, max + 1), x2: Math.min(x2, max + 1) };
  } else {
    const F = v.modMul(v, p2) + 1;

    x1 = (v + p2 - F.modMul(f1, p2)) % p2;
    x2 = p2 - x1;
  }
  if (x1 > x2) {
    [x1, x2] = [x2, x1];
  }
  return { p, x1: Math.min(x1, max + 1), x2: Math.min(x2, max + 1) };
}

function C(n, trace) {
  const visited = new BigSet();

  let total = n;

  const resolvePrime = (p) => {
    const sol = TonelliShanks(p - 1, p);
    if (sol === undefined) { throw "Error"; }
    return Hensel(sol, p, n);
  }

  const addFast = (p, x) => {
    const p2 = p * p;
    if (p2 > n) {
      if (x <= n) {
        total--;
      }
    } else {
      total -= Math.floor(n / p2);
      if (n % p2 >= x) {
        total--;
      }
    }
  };

  const tracer = new Tracer(trace);
  const primes = TimeLogger.wrap('', _ => {
    const primes = allPrimes
      .filter(p => p <= n)
      .reverse()
      .map(p => {
        tracer.print(_ => `calculate - ${p}`);
        return resolvePrime(p);
      })
      .filter(({ x1 }) => x1 <= n);
    tracer.clear();
    return primes;
  });

  const five = primes[primes.length - 1];
  five.p2 = 25;
  five.x1x2 = [five.x1, five.x2];
  five.includes = x => five.x1x2.includes(x % five.p2);

  addFast(five.p, five.x1);
  addFast(five.p, five.x2);

  const add = (x1, x2, p, min, max) => {
    const p2 = p * p;
    if (p2 > Number.MAX_SAFE_INTEGER) {
      if (x1 >= min && x1 <= max) {
        total--;
      }
      if (x2 >= min && x2 <= max) {
        total--;
      }
      return;
    }

    const innerAdd = x => {
      if (x <= max && !visited.has(x) && !five.includes(x)) {
        total--;
        visited.add(x);
      }
    };

    const k = Math.floor(min / p2);

    const offset = x => {
      x += k * p2;

      while (x < min) {
        x += p2;
      }

      return x;
    };

    x1 = offset(x1);
    x2 = offset(x2);

    if (x1 > max) {
      return;
    }

    const tracer2 = new Tracer(trace);

    while (x1 <= max) {
      tracer2.print(_ => max - x1);
      innerAdd(x1);
      innerAdd(x2);
      x1 += p2;
      x2 += p2;
    }
    tracer2.clear();
  };

  for (let min = 0; min < n; min += SECTION) {
    const max = Math.min(n, min + SECTION - 1);
    visited.clear();

    for (const { p, x1, x2 } of primes) {
      if (p === 5) {
        continue;
      }
      tracer.print(_ => `${n - min} - ${p}`);
      add(x1, x2, p, min, max);
    }
  }
  tracer.clear();
  return total;
}

assert.strictEqual(C(10), 9);
assert.strictEqual(C(1000), 895);
console.log('Tests passed');
const answer = TimeLogger.wrap('', _ => C(MAX_X, true));
console.log(`Ansswer is ${answer}`);