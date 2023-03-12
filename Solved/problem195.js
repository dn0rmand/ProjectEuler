const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const RADIUS = 1053779;

function gcd(a, b) {
  while (b !== 0) {
    let c = a % b;
    a = b;
    b = c;
  }
  return a;
};

function T(radius, trace) {
  const tracer = new Tracer(trace);

  function getRadius(a, b, c) {
    var s = (a + b + c) / 2;
    var r = Math.sqrt(s) * Math.sqrt(s - a) * Math.sqrt(s - b) * Math.sqrt(s - c)
    r /= s;

    return r;
  }

  function triangles(callback) {
    let a, b, c;


    let generate = (m, n) => {
      let n2 = n * n;
      let m2 = m * m;
      let mn = m * n;

      a = m2 - mn + n2;
      b = 2 * mn - n2;
      c = m2 - n2;

      if ((m + n) % 3 === 0) {
        a /= 3;
        b /= 3;
        c /= 3;
      }
    };

    let missed = 0;

    for (let n = 1; ; n++) {
      tracer.print(_ => n);

      let done = true;

      for (let m = n * 2 + 1; ; m++) {
        if ((m + n) % 3 === 0)
          continue;

        if (gcd(m, n) === 1) {
          generate(m, n);

          let r = getRadius(a, b, c);

          if (r > radius)
            break;

          done = false;
          callback(a, b, c);
        }
      }

      if (n % 3 !== 0) {
        let start = n * 2 + 1;
        while ((start + n) % 3 !== 0)
          start++;
        for (let m = start; ; m += 3) {
          if (gcd(m, n) === 1) {
            generate(m, n);

            let r = getRadius(a, b, c);

            if (r > radius)
              break;

            done = false;
            callback(a, b, c);
          }
        }
      }

      if (done) {
        missed++;
        if (missed === 3)
          break;
      }
      else
        missed = 0;
    }
  }

  let total = 0;

  triangles((a, b, c) => {
    let a1 = 0;
    let b1 = 0;
    let c1 = 0;
    let f = 0;

    while (true) {
      f++;

      a1 += a;
      b1 += b;
      c1 += c;

      let r1 = getRadius(a1, b1, c1);

      if (r1 > radius)
        break;

      total++;
    }
  });

  tracer.clear();

  return total;
}

assert.equal(T(100), 1234);
assert.equal(T(1000), 22767);
assert.equal(T(10000), 359912);

const answer = TimeLogger.wrap('', _ => T(RADIUS, true));
console.log('Answer is', answer);
