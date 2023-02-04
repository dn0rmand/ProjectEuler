const assert = require('assert');
const { TimeLogger, Tracer, BigSet, primeHelper } = require('@dn0rmand/project-euler-tools');

function doItAll(runTests) {
  const MODULO = 409120391n;
  const MAX_PRIME = 1e6;
  const MAX_PRIME_VALUE = BigInt(MAX_PRIME) ** 2n;

  const { allPrimes, primeLogs, primeSet } = TimeLogger.wrap('Loading primes', () => {
    primeHelper.initialize(MAX_PRIME, true);

    const primes = primeHelper.allPrimes();
    primes.push(261382937); // We need this one too :)

    const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));
    const primeLogs = primeHelper.allPrimes().map((p) => Math.log2(p) / 2);
    const primeSet = allPrimes.reduce((s, p) => {
      s.add(p);
      return s;
    }, new Set());

    return { allPrimes, primeLogs, primeSet };
  });

  const sortCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

  function isBadPrime(p) {
    if (p >= MAX_PRIME_VALUE) {
      debugger;
      return true;
    }
    return false;
  }

  function factorize(n, callback) {
    if (n === 1n) return;

    if (primeSet.has(n)) {
      callback(n, 1);
      return;
    }

    for (let p of allPrimes) {
      if (p > n) break;
      if (p * p > n) break;

      if (n % p === 0n) {
        let factor = 0;
        while (n % p === 0n) {
          factor++;
          n /= p;
        }
        if (callback(p, factor) === false) return; // Caller says to stop

        if (n === 1n || primeSet.has(n)) break;
      }
    }

    if (n !== 1n) {
      callback(n, 1);
    }
  }

  function divisors(value) {
    const primes = [];
    const divisors = [];

    factorize(value, (p, f) => {
      if (p === 2n) {
        // only the odd divisors
        return;
      }
      while (f--) {
        primes.push(p);
      }
    });

    function inner(value, index) {
      divisors.push(value);
      for (let i = index; i < primes.length; i++) {
        inner(value * primes[i], i + 1);
      }
    }

    if (primes.length === 0) {
      return [1n]; // no odd divisors
    }

    if (isBadPrime(primes[primes.length - 1])) {
      throw 'Error';
    }

    inner(1n, 0);
    divisors.sort(sortCompare);

    return divisors;
  }

  function Q(n) {
    n = BigInt(n);

    let bestLog = undefined;
    let best = undefined;

    function process(value, valueLog, a, primeCheck) {
      if (bestLog !== undefined && valueLog > bestLog) {
        return [value, valueLog];
      }
      let factors = [];
      factorize(a, (p, f) => {
        while (f--) {
          factors.push(p);
        }
      });
      factors.reverse();
      if (factors.length === 0) {
        return [value, valueLog];
      }

      if (isBadPrime(factors[0])) {
        return [undefined, undefined];
      }

      let pidx = 0;
      for (let factor of factors) {
        while (!primeCheck(allPrimes[pidx] % 4n)) {
          pidx++;
        }
        const plog = primeLogs[pidx];
        const p = allPrimes[pidx++];
        value = value.modMul(p.modPow((factor - 1n) / 2n, MODULO), MODULO);
        valueLog = valueLog + plog * Number(factor - 1n);
        if (p === 2n) {
          value = (value + value) % MODULO;
          valueLog += 1;
        }
        if (bestLog !== undefined && valueLog > bestLog) {
          break;
        }
      }

      return [value, valueLog];
    }

    for (const a4 of divisors(n + 1n)) {
      const a3 = (n + n + 2n - a4) / a4;

      let value = 1n;
      let valueLog = 0;

      [value, valueLog] = process(value, valueLog, a3, (p) => p !== 1n);
      if (value === undefined) {
        continue;
      }
      [value, valueLog] = process(value, valueLog, a4, (p) => p === 1n);
      if (value === undefined) {
        continue;
      }

      if (bestLog === undefined || bestLog > valueLog) {
        bestLog = valueLog;
        best = value;
      }
    }

    return best;
  }

  function solve(max) {
    let total = 0n;
    const tracer = new Tracer(true);
    for (let k = 1n; k <= max; k++) {
      tracer.print((_) => k);
      total = (total + Q(10n ** k)) % MODULO;
    }
    tracer.clear();
    return total;
  }

  if (runTests) {
    assert.strictEqual(Q(1000), 8064000n % MODULO);
    assert.strictEqual(Q(15), 65536n % MODULO);
    assert.strictEqual(Q(30), 2147483648n % MODULO);
    assert.strictEqual(Q(36), 137438953472n % MODULO);

    console.log('Tests passed');
  }

  const answer = solve(18);
  return answer;
}

const answer = TimeLogger.wrap('', () => doItAll(false));
console.log(`Anwer is ${answer}`);
