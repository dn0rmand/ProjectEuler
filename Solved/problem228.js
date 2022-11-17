const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const round = (value) => +value.toFixed(14);

class Point {
  constructor(x, y) {
    this.x = round(x);
    this.y = round(y);
  }

  plus(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  cross(other) {
    const cross1 = this.x * other.y;
    const cross2 = this.y * other.x;
    return round(cross1 - cross2);
  }
}

function generatePolygon(n) {
  const points = [];

  for (let k = 1; k <= n; k++) {
    const kk = 2 * k - 1;
    const rad = (kk * Math.PI) / n;

    const x = Math.cos(rad);
    const y = Math.sin(rad);
    points.push(new Point(x, y));
  }
  return points;
}

function sortPolygon(points) {
  let pos = 0;
  let current = points[pos];
  for (let i = 1; i < points.length; i++) {
    let pt = points[i];
    if (pt.y < current.y || (pt.y === current.y && pt.x < current.x)) {
      current = pt;
      pos = i;
    }
  }
  if (pos) {
    const oldPoints = [...points];
    for (let i = 0; i < points.length; i++) {
      points[i] = oldPoints[pos];
      pos = (pos + 1) % points.length;
    }
  }
}

function minkowski(P, Q) {
  // the first vertex must be the lowest
  sortPolygon(P);
  sortPolygon(Q);

  // we must ensure cyclic indexing
  P.push(P[0]);
  P.push(P[1]);
  Q.push(Q[0]);
  Q.push(Q[1]);

  // main part
  const result = [];
  let i = 0,
    j = 0;
  while (i < P.length - 2 || j < Q.length - 2) {
    const p = P[i];
    const q = Q[j];
    result.push(p.plus(q));
    const p1 = P[i + 1].minus(p);
    const q1 = Q[j + 1].minus(q);
    const cross = p1.cross(q1);
    if (cross >= 0) {
      i++;
    }
    if (cross <= 0) {
      j++;
    }
  }

  return result;
}

function add(n1, n2) {
  const P = generatePolygon(n1);
  const Q = generatePolygon(n2);

  const result = minkowski(P, Q);

  return result.length;
}

function solve(start, end) {
  const tracer = new Tracer(true);

  let current = generatePolygon(start);
  for (let n = start + 1; n <= end; n++) {
    tracer.print((_) => `${end - n}: ${current.length}`);
    let next = generatePolygon(n);
    current = minkowski(current, next);
  }
  tracer.clear();
  return current.length;
}

assert.strictEqual(add(3, 4), 6);
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(1864, 1909));
console.log(`Answer is ${answer}`);
