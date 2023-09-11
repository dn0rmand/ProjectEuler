const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

TimeLogger.wrap('', _ => {
  const MAX = 1E9;
  const TARGET = 120;

  TimeLogger.wrap('Loading primes', _ => {
    primeHelper.initialize(MAX, true);
  });

  function solve(max, target) {
    const $allPrimes = new Map();

    // function isSpecial(p) {
    //   if (p % 10 !== 1 && p % 10 !== 9) {
    //     return false;
    //   }

    //   const { f0, f1 } = fibonacci(p - 1, p);
    //   if (f0 === 0 && f1 === 1) {
    //     let result = true;
    //     primeHelper.factorize(p - 1, (a) => {
    //       const { f0, f1 } = fibonacci((p - 1) / a, p);
    //       if (f0 === 0 && f1 === 1) {
    //         result = false;
    //         return false;
    //       }
    //     });
    //     return result;
    //   } else {
    //     return false;
    //   }
    // }

    function getPrimePisano(p) {
      const maxLength = Math.min(target + 2, 2 * (p + 1));

      let f0 = 0;
      let f1 = 1;
      let count = 2;

      while (count < maxLength) {
        [f0, f1] = [f1, (f0 + f1) % p];
        count++;
        if (f0 === 0 && f1 === 1) {
          return count - 2;
        }
      }

      return maxLength;
    }

    function inneSolve(max, target) {
      const allPrimes = [];

      $allPrimes.forEach((info) => {
        if (target % info.pisano === 0) {
          allPrimes.push(info);
        }
      });

      let total = 0;

      function inner(index, value, pi) {
        if (pi === target) {
          total += value;
        }

        if (target % pi !== 0) {
          return;
        }

        for (let i = index; i < allPrimes.length; i++) {
          let { prime, pisano } = allPrimes[i];
          let v = value * prime;
          if (v >= max) {
            break;
          }
          if (target % pisano !== 0) {
            continue;
          }
          if (target % prime === 0) {
            while (v < max) {
              const pi2 = pi.lcm(pisano);
              if (pi2 > target) {
                break;
              }
              inner(i + 1, v, pi2);
              v *= prime;
              pisano *= prime;
            }
          } else {
            const pi2 = pi.lcm(pisano);
            if (pi <= target) {
              inner(i + 1, v, pi2);
            }
          }
        }
      }

      inner(0, 1, 1);

      return total;
    }

    TimeLogger.wrap('Pre-calculating', _ => {
      const addPrime = (v) => {
        $allPrimes.set(v.prime, v);
      }
      const tracer = new Tracer(true);
      const allPrimes = primeHelper.allPrimes();

      if (target % 3 === 0) {
        addPrime({ prime: 2, pisano: 3 });
      }
      if (target % 8 === 0) {
        addPrime({ prime: 3, pisano: 8 });
      }
      if (target % 20 === 0) {
        addPrime({ prime: 5, pisano: 20 });
      }

      for (let i = 3; i < allPrimes.length; i++) {
        tracer.print(_ => allPrimes.length - i);
        const prime = allPrimes[i];
        if (prime > max) {
          break;
        }
        const special = false; //isSpecial(prime);
        const pisano = special ? prime - 1 : getPrimePisano(prime);
        if (target % pisano === 0) {
          addPrime({
            prime,
            pisano,
          });
        }
      }
      tracer.clear();
    });

    const result = inneSolve(max, target);
    return result;
  }

  assert.strictEqual(solve(50, 18), 57);
  assert.strictEqual(solve(1E5, 120), 4858757);

  const answer = TimeLogger.wrap('', _ => solve(MAX, TARGET));
  console.log(`Answer is ${answer}`);
});