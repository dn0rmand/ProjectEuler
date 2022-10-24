const { PreciseNumber, TimeLogger } = require('@dn0rmand/project-euler-tools');

PreciseNumber.setUseBigInt(false);

const allValues = (function () {
  const values = new Map();
  for (let a = 1; a <= 35; a++) {
    for (let b = a + 1; b <= 35; b++) {
      const v = PreciseNumber.create(a, b);
      const k = v.toString();
      if (!values.has(k)) {
        values.set(k, v);
      }
    }
  }
  const sortedValues = [...values.values()].sort((a, b) => (a.less(b) ? -1 : a.greater(b) ? 1 : 0));
  return sortedValues;
})();

function root(value, p) {
  if (p < 0) {
    value = PreciseNumber.create(value.divisor, value.numerator);
    p = -p;
  }
  const top = Math.floor(Math.pow(Number(value.numerator), 1 / p));
  const bottom = Math.floor(Math.pow(Number(value.divisor), 1 / p));
  if (top > 0 && bottom > top) {
    const r = PreciseNumber.create(top, bottom);
    if (r.numerator <= 35 && r.divisor <= 35 && r.pow(p).equals(value)) {
      return r;
    }
  }
}

function pow(value, p) {
  if (p < 0) {
    value = PreciseNumber.create(value.divisor, value.numerator);
    p = -p;
  }
  return value.pow(p);
}

// x^n+y^n-z^n = 0
// x^n = z^n - y^n
function goldenTriplets(callback) {
  const powers = [-2, -1, 1, 2];
  for (let ix = 0; ix < allValues.length; ix++) {
    const x = allValues[ix];
    for (let iy = ix; iy < allValues.length; iy++) {
      const y = allValues[iy];
      for (const p of powers) {
        const z = root(pow(x, p).plus(pow(y, p)), p);
        if (z) {
          callback(x.plus(y).plus(z));
        }
      }
    }
  }
}

function t() {
  const visited = new Set();
  PreciseNumber.setUseBigInt(true);
  let r = PreciseNumber.Zero;
  PreciseNumber.setUseBigInt(false);

  goldenTriplets((s) => {
    if (!visited.has(s.toString())) {
      visited.add(s.toString());
      PreciseNumber.setUseBigInt(true);
      r = r.plus(PreciseNumber.create(s.numerator, s.divisor));
      PreciseNumber.setUseBigInt(false);
    }
  });
  return r.divisor + r.numerator;
}

const answer = TimeLogger.wrap('', (_) => t());
console.log(`Answer is ${answer}`);
