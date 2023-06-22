const { TimeLogger, Tracer, PreciseNumber } = require('@dn0rmand/project-euler-tools');

let $cache = undefined;
let $remaining = -1;

function innerRoll(remaining, sides) {
  if ($cache !== undefined && $remaining === remaining) {
    return $cache;
  }

  if (remaining === 1) {
    const r = new Array(sides + 1);
    r.fill(1n);
    r[0] = 0n;
    return r;
  }

  const states = new Array(sides * remaining + 1);
  states.fill(0n);
  const s = innerRoll(remaining - 1, sides);
  for (let i = 0; i < s.length; i++) {
    for (let v = 1; v <= sides; v++) {
      states[i + v] = states[i + v] + s[i];
    }
  }
  return states;
}

function roll(remaining, sides) {
  const r = innerRoll(remaining, sides);

  $remaining = remaining;
  $cache = r;

  // for (let i = 0; i < r.length; i++) {
  //   if (r[i]) {
  //     callback(i, r[i]);
  //   }
  // }
  return r;
}

function getAverage(states) {
  let sum = 0n;
  let count = 0n;
  for (let i = 0; i <= states.length; i++) {
    const c = states[i];
    if (c) {
      count += c;
      sum += c * BigInt(i);
    }
  }

  return PreciseNumber.create(sum, count);
}

function getVariance(states, average) {
  let sum = PreciseNumber.Zero;
  let count = 0n;
  for (let i = 0; i < states.length; i++) {
    const c = states[i];
    if (c) {
      count += c;
      const v = PreciseNumber.create(i, 1).minus(average).pow(2).times(c);
      sum = sum.plus(v);
    }
  }

  return sum.divide(count);
}

function solve(trace) {
  let states = new Array(4 + 1);

  states.fill(1n);
  states[0] = 0n;

  const tracer = new Tracer(trace, 'Calculating');

  let max = 4;
  for (const sides of [6, 8, 12, 20]) {
    $cache = undefined;

    // Now roll

    newStates = new Array(max * sides + 1);
    newStates.fill(0n);

    let weight = BigInt(sides) ** BigInt(max);
    for (let i = 0; i < states.length; i++, weight /= BigInt(sides)) {
      tracer.print(_ => `${sides}: ${states.length - i}`);

      let count = states[i];
      if (!count) {
        continue;
      }

      count *= weight;

      const r = roll(i, sides);
      for (let v = 0; v < r.length; v++) {
        const c = r[v];
        if (c) {
          newStates[v] = newStates[v] + (count * c);
          if (v > max) {
            max = v;
          }
        }
      }
    }
    states = newStates;
  }

  tracer.clear();
  tracer.print(_ => 'finishing up');

  const average = getAverage(states);
  const variance = getVariance(states, average);

  tracer.clear();
  return variance.valueOf(6).toFixed(4);
}

const answer = TimeLogger.wrap('', _ => solve(true));

console.log(`Answer is ${answer}`);
