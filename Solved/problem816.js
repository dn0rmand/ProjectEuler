const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

function* S() {
  let current = 290797;

  while (true) {
    yield current;
    current = current ** 2 % 50515093;
  }
}

function distance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function subDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function d(n, trace) {
  const points = [];

  const iterator = S();
  while (points.length < n) {
    const x = iterator.next().value;
    const y = iterator.next().value;

    points.push({ x, y });
  }

  points.sort((p1, p2) => p1.x - p2.x);

  let point0 = points[0];
  let point1 = points[1];
  let min = subDistance(point0, point1);

  const tracer = new Tracer(trace);
  for (let i = 0; i < points.length; i++) {
    tracer.print((_) => points.length - i);
    const p1 = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const p2 = points[j];
      const dx = (p1.x - p2.x) ** 2;
      if (dx >= min) {
        break;
      }
      const dy = (p1.y - p2.y) ** 2;
      const d = dx + dy;
      if (d < min) {
        min = d;
      }
    }
  }
  tracer.clear();
  return Math.sqrt(min).toFixed(9);
}

assert(d(10), 9262015.547769556);
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => d(2000000, true));
console.log(`Answer is ${answer}`);
