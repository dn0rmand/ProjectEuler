const assert = require('assert');
const { TimeLogger, Tracer, announce } = require('@dn0rmand/project-euler-tools');

function getPoints(r) {
  const points = [];
  const r2 = r * r;
  let totalCount = 0;

  for (let x = 0; x < r; x++) {
    const x2 = x * x;
    const maxY = Math.ceil(Math.sqrt(r2 - x2));
    for (let y = 0; y < maxY; y++) {
      if (y !== 0 || x !== 0) {
        points.push({ x, y });
      }
      totalCount++;
      if (x > 0) {
        totalCount++;
      }
      if (y > 0) {
        totalCount++;
      }
      if (x > 0 && y > 0) {
        totalCount++;
      }
    }
  }

  const pts = points.reduce((m, { x, y }) => {
    [x, y] = simplify(x, y);
    const k = x * 110 + y;
    const old = m.get(k);
    if (old) {
      old.count++;
    } else {
      m.set(k, { x, y, count: 1 });
    }
    return m;
  }, new Map());
  return { points, pts, totalCount };
}

function simplify(x, y) {
  const g = Math.abs(x.gcd(y));
  x /= g;
  y /= g;
  return [x, y];
}

function processPoint3(x1, y1, x2, y2, q2, x3, y3, q3) {
  if (q2 === 0 && q3 !== 2) {
    return 0;
  }
  if (q3 === 0 && q2 !== 2) {
    return 0;
  }
  if (q2 !== 2 && q2 === q3) {
    return 0;
  }

  const x1y2_x2y1 = x1 * y2 - x2 * y1;
  let D = Math.abs(x1y2_x2y1);

  const x2_x1 = x2 - x1;
  const y1_y2 = y1 - y2;

  A = Math.abs(x1y2_x2y1 + y3 * x2_x1 + x3 * y1_y2);
  if (A === 0 || A <= D) {
    return 0;
  }
  B = Math.abs(x2 * y3 - x3 * y2);
  D += B;
  if (B === 0 || A <= D) {
    return 0;
  }
  C = Math.abs(x3 * y1 - x1 * y3);
  D += C;
  if (C === 0 || A !== D) {
    return 0;
  }
  return 1;
}

function processPoint2(x1, y1, x2, y2, pts, q2) {
  if (x1 * y2 === x2 * y1) {
    return 0;
  }

  let baseKey;
  baseKey = x1 ? 1 : 0;
  baseKey = (y1 ? 1 : 0) + 2 * baseKey;
  baseKey = (x2 ? 1 : 0) + 2 * baseKey;
  baseKey = (y2 ? 1 : 0) + 2 * baseKey;

  let total = 0;

  const allPos = x1 > 0 && y1 > 0 && x2 > 0 && y2 > 0;

  for (const { x: x3, y: y3, count } of pts.values()) {
    if (allPos && x3 > 0 && y3 > 0) {
      continue;
    }

    let t = 0;

    const key = (y3 ? 1 : 0) + 2 * ((x3 ? 1 : 0) + 2 * baseKey);
    switch (key) {
      case 30:
      case 54:
      case 62:
        t = q2 === 0 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, y3, 3);
        break;
      case 45:
      case 57:
      case 61:
        t = q2 !== 3 ? 0 : processPoint3(x1, y1, x2, y2, q2, x3, -y3, 1);
        break;
      case 31:
      case 55:
        t = q2 === 2 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, -y3, 2);
        t += q2 === 0 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, y3, 3);
        break;
      case 47:
      case 59:
        t = q2 !== 3 ? 0 : processPoint3(x1, y1, x2, y2, q2, x3, -y3, 1);
        t += q2 === 2 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, -y3, 2);
        break;
      case 63:
        t = q2 !== 3 ? 0 : processPoint3(x1, y1, x2, y2, q2, x3, -y3, 1);
        t += q2 === 2 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, -y3, 2);
        t += q2 === 0 ? 0 : processPoint3(x1, y1, x2, y2, q2, -x3, y3, 3);
        break;

      default:
        break;
    }

    total += count * t;
  }

  return total;
}

function processPoint1(x1, y1, pts, totalCount, n) {
  let total = 0;

  const T1 = totalCount + 3 - 4 * n;

  for (const { x: x2, y: y2, count } of pts.values()) {
    if (x2 > y2 || y2 === 0) {
      continue;
    }

    let t = 0;

    if (x1 === 0) {
      if (x2 === 0) {
        t += T1;
      } else {
        const t1 = 2 * (processPoint2(x1, y1, x2, y2, pts, 0) + processPoint2(x1, y1, x2, -y2, pts, 1));
        if (x2 !== y2) {
          t += t1;
        }
        t += t1;
      }
    } else if (y1 === 0) {
      if (x2 !== 0 && y2 !== 0) {
        const t1 = 2 * (processPoint2(x1, y1, x2, y2, pts, 0) + processPoint2(x1, y1, -x2, y2, pts, 3));
        if (x2 !== y2) {
          t += t1;
        }
        t += t1;
      }
    } else if (x2 === 0) {
      t += 2 * (processPoint2(x1, y1, x2, y2, pts, 0) + processPoint2(x1, y1, x2, -y2, pts, 1));
    } else {
      const t1t40 = x1 === x2 && y1 === y2;
      const t2t3same = t1t40 && x1 === y1;
      const t2 = processPoint2(x1, y1, -x2, y2, pts, 3);
      const t3 = t2t3same ? t2 : processPoint2(x1, y1, x2, -y2, pts, 1);

      const t1 = t1t40 ? t2 + t3 : 2 * (t2 + t3);

      t += t1;
      if (x2 !== y2) {
        t += t1;
        if (x1 === x2 && y1 === y2) {
          t += t1;
        }
      }
    }
    total += t * count;
  }

  return total;
}

function solve(n, trace) {
  const { pts, totalCount } = trace ? TimeLogger.wrap('', (_) => getPoints(n)) : getPoints(n);

  const tracer = new Tracer(trace);

  const p8 = processPoint1(1, 0, pts, totalCount, n);
  const p4 = processPoint1(0, 1, pts, totalCount, n);

  let total = (p4 + p8) * (n - 1);

  let size = pts.size;
  for (const { x: x1, y: y1, count } of pts.values()) {
    tracer.print((_) => size);
    size--;
    if (x1 === 0 || y1 === 0 || x1 > y1) {
      continue;
    }
    const t = count * 2 * processPoint1(x1, y1, pts, totalCount, n);

    if (x1 !== y1) {
      total += t;
    }
    total += t;
  }
  tracer.clear();
  total /= 3;
  return total;
}

assert.strictEqual(solve(2), 8);
assert.strictEqual(solve(3), 360);
assert.strictEqual(solve(5), 10600);
assert.strictEqual(
  TimeLogger.wrap('', (_) => solve(20)),
  78743520
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(105, true));
console.log(`Answer is ${answer}`);
announce(184, `Answer is ${answer}`);
