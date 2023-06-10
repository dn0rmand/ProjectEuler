const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 200000;

primeHelper.initialize(MAX);

const thresoldFilter = (g, index) => (index < 5);

function remap(groups, values) {
  const newValues = [];
  const newMap = [];
  const counts = [];

  const _remap1 = (value, i) => {
    if (newMap[i] !== undefined) {
      return newMap[i];
    }
    newValues.push(value);
    newMap[i] = newValues.length - 1;
    return newMap[i];
  };

  const _remap = g => {
    const k = _remap1(values[g.i], g.i);
    counts[k] = (counts[k] || 0) + 1;
    g.i = k;
    return g;
  };

  const primeGroups = groups.map(group => group.map(g => _remap(g)));

  return [primeGroups, newValues, counts];
}

function Co(n, trace) {
  let values = [];
  const multiPower = [];

  let max = 1;

  function prepare() {
    for (const p of primeHelper.allPrimes()) {
      if (p > n) {
        break;
      }
      if (p * 2 >= n) {
        max += p;
        continue;
      }

      let v = p;
      let f = 1;
      while (v * p <= n) {
        v *= p;
        f++;
      }

      max += v;

      if (f > 1) {
        multiPower.push({ value: v, prime: p, power: f });
      } else {
        values.push(v);
      }
    }

    values.sort((a, b) => a - b);
  }

  function simplify(primeGroups) {
    let counts;

    // trim down search space
    primeGroups = primeGroups.map(group => group.filter(thresoldFilter));

    [primeGroups, values, counts] = remap(primeGroups, values);

    for (let k = 0; k < primeGroups.length; k++) {
      const { gain, i } = primeGroups[k][0];
      if (counts[i] === 1) {
        max += gain;
        values[i] = 0;
        primeGroups[k] = [];
      }
    }

    primeGroups = primeGroups.filter(g => g.length);

    [primeGroups, values, counts] = remap(primeGroups, values);

    return primeGroups;
  }

  function groupGains(gains) {
    let primeGroups = gains.reduce((a, g) => {
      if (!a[g.j]) {
        a[g.j] = [g];
      } else {
        a[g.j].push(g);
      }
      return a;
    }, []).filter(g => {
      if (g) {
        g.sort((a, b) => b.gain - a.gain);
        return g;
      }
    }).sort((g1, g2) => g2[0].gain - g1[0].gain);

    let l = primeGroups.length;

    primeGroups = simplify(primeGroups);
    while (primeGroups.length < l) {
      l = primeGroups.length;
      primeGroups = simplify(primeGroups);
    }
    return primeGroups;
  }

  function getGains() {
    const gains = [];

    for (let i = 0; i < values.length; i++) {
      const v1 = values[i];
      if (!v1) {
        continue;
      }
      for (let j = 0; j < multiPower.length; j++) {
        const { value: v2, prime: p } = multiPower[j];
        if (!v2) {
          continue;
        }
        let current = v1 + v2;
        let newValue = v1 * p;
        if (newValue > n) {
          break;
        }
        while (newValue * p <= n) {
          newValue *= p;
        }
        if (newValue >= current) {
          const gain = newValue - current;
          gains.push({ gain, i, j, prime: p });
        }
      }
    }

    gains.sort((a, b) => a.prime === b.prime ? b.gain - a.gain : a.prime - b.prime);

    const primeGroups = groupGains(gains);

    return primeGroups;
  }

  const $maxGains = new Map();
  function calculateMaxGain(primeGroups, index) {
    if (index >= primeGroups.length) {
      return 0;
    }

    const key = values.reduce((a, v) => a * 2n + (v ? 1n : 0n), 0n) * 100n + BigInt(index);
    let maxGain = $maxGains.get(key);
    if (maxGain !== undefined) {
      return maxGain;
    }

    const group = primeGroups[index];

    maxGain = 0;

    const tracer = new Tracer(trace && index <= 10);

    for (let z = 0; z < group.length; z++) {
      const { gain, i } = group[z];
      tracer.print(_ => group.length - z);
      const v1 = values[i];
      if (v1) {
        values[i] = 0;
        const g = gain + calculateMaxGain(primeGroups, index + 1);
        if (g > maxGain) {
          maxGain = g;
        }
        values[i] = v1;
      }
    }

    tracer.clear();

    $maxGains.set(key, maxGain);
    return maxGain;
  }

  prepare();

  const primeGroups = getGains();

  max += calculateMaxGain(primeGroups, 0);

  return max;
}

assert.strictEqual(Co(10), 30);
assert.strictEqual(Co(30), 193);
assert.strictEqual(Co(100), 1356);
assert.strictEqual(TimeLogger.wrap('Co(900)', _ => Co(900)), 70531);

console.log('Tests passed');

const answer = TimeLogger.wrap(`Co(${MAX})`, _ => Co(MAX, true));
console.log(`Answer is ${answer}`);