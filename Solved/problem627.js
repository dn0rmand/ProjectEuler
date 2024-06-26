// Counting products
// Problem 627

// Consider the set S of all possible products of n positive integers not exceeding m , 
// that is S={ x1x2…xn|1 ≤ x1,x2,...,xn ≤ m }

// Let F(m,n) be the number of the distinct elements of the set S

// For example, F(9,2)=36 and F(30,2)=308.

// Find F(30,10001) mod 1000000007.

const assert = require('assert');
const { primeHelper } = require('@dn0rmand/project-euler-tools');

const MODULO = BigInt(1000000007);

primeHelper.initialize(300);

function calculate(equation, n) {
  assert.notEqual(equation.length, undefined);
  assert.notEqual(equation.length, 0);

  // Get Divisor and make sure it the same for all entries
  let divisor = undefined;

  for (let e of equation) {
    if (divisor === undefined)
      divisor = e.divisor;
    else
      assert.equal(divisor, e.divisor);
  }
  // Calculate now

  let result = BigInt(0);

  n = BigInt(n);
  for (let i = 0; i < equation.length; i++) {
    let p = n.modPow(i + 1, MODULO);
    let v = (p * BigInt(equation[i].nominator)) % MODULO;

    result = (result + v) % MODULO;
  }

  let d = BigInt(divisor).modInv(MODULO);

  result = (((result * d) % MODULO) + BigInt(1)) % MODULO;
  return Number(result);
}

function F9(n) {
  n = BigInt(n);

  let div = BigInt(4);

  let a = BigInt(4);
  let b = BigInt(12);
  let c = BigInt(13);
  let d = BigInt(6);
  let e = BigInt(1);

  let n2 = n * n;
  let n3 = n * n2;
  let n4 = n * n3;

  let result = a + n * b + n2 * c + n3 * d + n4 * e;

  return Number((result / div) % MODULO);
}

function F(m, n) {
  let factors = [];
  let visited = new Set();
  let values = [];
  let total = 0;

  function factorize(value) {
    if (factors[value] !== undefined)
      return factors[value];

    let facts = [];
    let v = value;
    for (let p of primeHelper.allPrimes()) {
      if (p > v)
        break;

      if (v % p === 0) {
        while (v % p === 0) {
          facts.push(p);
          v /= p;
        }
      }
    }
    if (v !== 1)
      throw error;

    factors[value] = facts;

    return facts;
  }

  function inner(start, count) {
    if (count === n) {
      if (values.length > 0) {
        let a = Array.from(values);
        let k = a.sort((a, b) => a - b).join('-');

        if (!visited.has(k)) {
          visited.add(k);
          total++;
        }
      }
      return;
    }

    for (let x = start; x <= m; x++) {
      if (x === 1) {
        inner(x, count + 1);
      }
      else {
        let size = values.length;
        let f = factorize(x);
        values.push(...f);
        inner(x, count + 1);
        while (values.length !== size)
          values.pop();
      }
    }
  }

  inner(1, 0);
  return total + 1;
}

function format(M, values) {
  let power = values.length;
  let s = "F(" + M + ",n) = ";
  let first = true;

  for (let index = values.length; index > 0; index--) {
    let c = values[index - 1];
    let value = "(" + c.nominator + "/" + c.divisor + ")";

    if (!first)
      s += " + ";

    if (power > 1)
      s += value + "*n^" + power;
    else if (power > 0)
      s += value + "*n";

    power--;
    first = false;
  }

  return s + " + 1";
}

function OP(values) {
  let maxCount = values.length;

  function reduce(ref, state) {
    while (true) {
      for (let i = 0; i < maxCount; i++) {
        if (state.factors[i] < ref.factors[i])
          return;
      }
      state.value -= ref.value;
      for (let i = 0; i < maxCount; i++) {
        let v = ref.factors[i];
        if (v === 0)
          continue;
        state.factors[i] -= v;
        if (state.factors[i] === 0)
          state.count--;
      }
      if (state.count === 1) {
        for (let i = 0; i < maxCount; i++) {
          if (state.factors[i] !== 0) {
            if (state.value % state.factors[i] === 0) {
              state.value /= state.factors[i];
              state.factors[i] = 1;
            }
          }
        }
      }
    }
  }

  function reduceAll(state) {
    while (true) {
      let divisor = 1;

      for (let i = 0; i < maxCount; i++) {
        if (state.factors[i] === 0)
          continue;

        let d = state.value.gcd(state.factors[i]);
        if (d === 1)
          return;

        if (divisor === 1)
          divisor = d;
        else
          divisor = divisor.gcd(d);

        if (divisor === 1)
          return;
      }

      if (divisor === 1)
        return;

      state.value /= divisor;
      for (let i = 0; i < maxCount; i++)
        state.factors[i] /= divisor;
    }
  }

  function apply(ref, state) {
    if (state.count === 1)
      return false;

    let didSomething = false;

    for (let i = 0; i < maxCount; i++) {
      let rf = ref.factors[i];
      if (rf === 0)
        continue;

      for (let j = i + 1; j < maxCount; j++)
        if (ref.factors[j] !== 0)
          throw "ERROR";

      if (state.factors[i] === 0)
        break;

      if (state.factors[i] < rf) {
        if (rf % state.factors[i] === 0) {
          let m = rf / state.factors[i];
          for (let j = 0; j < maxCount; j++)
            state.factors[j] *= m;
          state.value *= m;
          didSomething = true;
        }
        else {
          let fa = state.factors[i];
          reduceAll(state);
          if (fa !== state.factors[i]) {
            didSomething = true;
          }
          else {
            let d = rf.gcd(fa);
            if (d !== 1) {
              let vf = rf / d;
              let va = fa / d;

              ref.factors[i] *= va;
              ref.value *= va;
              state.value *= vf;
              rf = ref.factors[i];

              for (let j = 0; j < maxCount; j++) {
                state.factors[j] *= vf;
              }
            }
          }
        }
      }

      while (state.factors[i] >= rf) {
        state.value -= ref.value;
        state.factors[i] -= rf;
        didSomething = true;
      }

      if (state.factors[i] === 0) {
        didSomething = true;
        state.count--;
      }
      break;
    }

    if (state.count === 1) {
      for (let i = 0; i < maxCount; i++) {
        if (state.factors[i] !== 0) {
          let div = Math.abs(state.value).gcd(Math.abs(state.factors[i]));
          if (div > 1) {
            state.value /= div;
            state.factors[i] /= div;
            didSomething = true;
          }
          break;
        }
      }
    }

    return didSomething;
  }

  let states = [];
  let x = 1;

  for (let u of values) {
    let state = {
      value: u - 1,
      factors: [],
      count: maxCount
    };
    let X = 1;
    for (let f = 1; f <= maxCount; f++) {
      X = X * x;
      state.factors.push(X);
    }
    states.push(state);
    x++;
    if (x > maxCount)
      break;
  }

  for (let ref = 0; ref < states.length; ref++) {
    for (let state = ref + 1; state < states.length; state++) {
      reduce(states[ref], states[state]);
    }
  }

  let allSolved = true;
  for (let ref = states.length - 1; ref >= 0; ref--) {
    let refState = states[ref];
    if (refState.count === 1) {
      reduceAll(refState);
      for (let s = ref - 1; s >= 0; s--) {
        if (apply(refState, states[s])) {
          // Restart
          ref = states.length;
          allSolved = true;
          break;
        }
      }
    }
    else
      allSolved = false;
  }

  assert.equal(allSolved, true);

  let solutions = [];
  let maxDivisor = 0;
  for (let state of states) {
    for (let i = 0; i < maxCount; i++) {
      let factor = state.factors[i];
      if (factor !== 0) {
        assert.equal(solutions[i], undefined);
        if (factor > maxDivisor)
          maxDivisor = factor;

        solutions[i] = { nominator: state.value, divisor: factor }
        break;
      }
    }
  }

  for (let i = 0; i < maxCount; i++) {
    let s = solutions[i];
    assert.notEqual(s, undefined);
    if (maxDivisor % s.divisor === 0) {
      let m = maxDivisor / s.divisor;
      s.divisor *= m;
      s.nominator *= m;
    }
    else
      console.log(maxDivisor, "is not a multiple of", s.divisor)
  }

  return solutions;
}

function test() {
  assert.equal(F(9, 2), 36);
  assert.equal(F(30, 2), 308);

  let solutions = OP([F(9, 1), F(9, 2), F(9, 3), F(9, 4)]);

  for (let i = 1; i <= 10; i++)
    assert.equal(calculate(solutions, i), F(9, i));

  console.log("Tests passed");
}


/* PRE-CALCULATED via brute force

F(30,0) = 1
F(30,1) = 30
F(30,2) = 308
F(30,3) = 1909
F(30,4) = 8679
F(30,5) = 31856
F(30,6) = 99814
F(30,7) = 276705
F(30,8) = 695552
F(30,9) = 1613612
F(30,10)= 3500640

*/

function solve(usePrecalculated) {
  // Pre-Calculated values
  let values;

  if (usePrecalculated === true)
    values = [30, 308, 1909, 8679, 31856, 99814, 276705, 695552, 1613612, 3500640];
  else {
    values = [];
    for (let i = 1; i <= 10; i++)
      values[i] = F(30, i);
  }

  let solutions = OP(values);

  for (let i = 0; i < values.length; i++) {
    let v = calculate(solutions, i + 1);
    assert.equal(v, values[i]);
  }

  let result = calculate(solutions, 10001);
  return result;
}

test();
let answer = solve(true);
console.log('Answer is', answer);
