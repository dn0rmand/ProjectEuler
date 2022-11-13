const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX_ANGLE = 180;

const SIZE = 10;
const A = { x: 0, y: 0 };
const C = { x: SIZE, y: 0 };

function toRadian(angle) {
  return (angle * Math.PI) / 180;
}

function toDegrees(angle) {
  return (angle * 180) / Math.PI;
}

const PRECISION = 1e-9;

function checkQuadrilateral(q) {
  const { b, c, d } = q;
  const dc = (d.x - c.x) ** 2 + (d.y - c.y) ** 2;
  const db = (d.x - b.x) ** 2 + (d.y - b.y) ** 2;
  const cb = (c.x - b.x) ** 2 + (c.y - b.y) ** 2;
  const cosC = (dc + db - cb) / (2 * Math.sqrt(dc * db));
  const cR = Math.acos(cosC);
  const angle = toDegrees(cR);

  if (Math.abs(Math.round(angle) - angle) <= PRECISION) {
    q.cdb = Math.round(angle);
    q.cbd = 180 - q.dca - q.bca - q.cdb;
    q.adb = q.adc - q.cdb;
    q.abd = q.abc - q.cbd;
    return true;
  }
}

function getTriangles() {
  // get intersection point
  function getD(alpha, beta) {
    alpha = toRadian(alpha);
    beta = toRadian(beta);

    const slope1 = +Math.sin(alpha) / Math.cos(alpha);
    const slope2 = -Math.sin(beta) / Math.cos(beta);

    const x = (SIZE * slope2) / (slope2 - slope1);
    const y = slope1 * x;

    return { x, y };
  }

  const triangles = [];
  for (let alpha = 1; alpha < MAX_ANGLE; alpha++) {
    for (let beta = 1; alpha + beta < MAX_ANGLE; beta++) {
      const { x, y } = getD(alpha, beta);
      const t = {
        a: A,
        d: { x, y },
        c: C,
        dca: beta,
        dac: alpha,
        adc: 180 - beta - alpha,
      };
      triangles.push(t);
    }
  }

  triangles.sort((a, b) => a.dac - b.dac);
  return triangles;
}

function solve() {
  const triangles = getTriangles();

  const tracer = new Tracer(true);

  const visited = new Set();

  function exists({ dac, adb, cdb, dca, bca, cbd, abd, bac }) {
    const angles = [dac, adb, cdb, dca, bca, cbd, abd, bac];
    if (visited.has(angles.join(':'))) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      visited.add(angles.join(':'));
      angles.push(angles.shift());
      angles.push(angles.shift());
    }

    angles.reverse();

    for (let i = 0; i < 4; i++) {
      visited.add(angles.join(':'));
      angles.push(angles.shift());
      angles.push(angles.shift());
    }
    return false;
  }

  let quadrilaterals = 0;
  for (const t1 of triangles) {
    if (t1.dac > 45) {
      break;
    }
    tracer.print((_) => `${45 - t1.dac}: ${quadrilaterals}`);
    for (const t2 of triangles) {
      if (t1.dac + t2.dac >= 180) {
        break;
      }
      if (t1.dca + t2.dca >= 180) {
        continue;
      }
      const q = {
        ...t1,
        b: { x: t2.d.x, y: -t2.d.y },
        bca: t2.dca,
        bac: t2.dac,
        abc: t2.adc,
      };

      if (checkQuadrilateral(q) && !exists(q)) {
        quadrilaterals++;
      }
    }
  }
  tracer.clear();
  return quadrilaterals;
}

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
