// Crossed lines
// -------------
// Problem 630
// -----------
// Given a set, L, of unique lines, let M(L) be the number of lines in the set and let S(L) be the sum
// over every line of the number of times that line is crossed by another line in the set. For example,
// two sets of three lines are shown below: <image>

// In both cases M(L) is 3 and S(L) is 6: each of the three lines is crossed by two other lines.
// Note that even if the lines cross at a single point, all of the separate crossings of lines are counted.

// Consider points (T2k−1, T2k), for integer k >= 1 , generated in the following way:

// S0   = 290797
// Sn+1 = Sn^2 mod 50515093
// Tn   = ( Sn mod 2000 ) − 1000

// For example, the first three points are: (527, 144), (−488, 732), (−454, −947). Given the first n points
// generated in this manner, let Ln be the set of unique lines that can be formed by joining each point with
// every other point, the lines being extended indefinitely in both directions. We can then define M(Ln) and
// S(Ln) as described above.

// For example, M(L3)=3 and S(L3)=6. Also M(L100)=4948 and S(L100)=24477690.

// Find S(L2500).

const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');
const bigInt = require('big-integer');

function* S() {
    let s = bigInt(290797);

    while (true) {
        s = s.modPow(2, 50515093);
        yield s.valueOf();
    }
}

function* T() {
    let s = S();

    while (true) {
        let x = (s.next().value % 2000) - 1000;
        let y = (s.next().value % 2000) - 1000;

        yield { x: x, y: y };
    }
}

function M(count, lineAdded) {
    const points = [];
    const lines = [];
    const duplicates = {};

    if (lineAdded === undefined) lineAdded = () => {};

    function loadPoints() {
        for (let pt of T()) {
            points.push(pt);
            if (points.length >= count) break;
        }
    }

    function makeLines(index) {
        if (index >= points.length) return;

        const pt1 = points[index];
        for (let i = index + 1; i < points.length; i++) {
            const pt2 = points[i];

            let num = pt1.y - pt2.y;
            let div = pt1.x - pt2.x;

            if (div === 0) {
                const k = '|' + pt1.x;
                if (duplicates[k] === undefined) {
                    duplicates[k] = 1;
                    const line = { n: 1, d: 0 };
                    lines.push(line);
                    lineAdded(line);
                }
            } else {
                let b = pt1.x * pt2.y - pt2.x * pt1.y;

                if (div < 0) {
                    num *= -1;
                    div *= -1;
                    b *= -1;
                }

                const d = Math.abs(num.gcd(div));

                num = num / d;
                div = div / d;
                b = b / d;

                const k = num + ':' + div + ':' + b;

                if (duplicates[k] === undefined) {
                    duplicates[k] = 1;
                    const line = { n: num, d: div };
                    lines.push(line);
                    lineAdded(line);
                }
            }
        }

        makeLines(index + 1);
    }

    loadPoints();
    makeLines(0);

    return lines;
}

function Solve(count) {
    const slopes = {};

    function countSlopes(l) {
        const k = l.n + ':' + l.d;
        if (slopes[k] === undefined) slopes[k] = 1;
        else slopes[k]++;
    }

    const lines = M(count, countSlopes);
    const len = lines.length;

    function cross(line) {
        const l1 = lines[line];
        const k = l1.n + ':' + l1.d;
        const parallels = slopes[k];
        const count = len - parallels;

        return count;
    }

    let total = 0;

    for (let l = 0; l < len; l++) total += cross(l);

    return total;
}

assert.equal(M(3).length, 3);
assert.equal(Solve(3), 6);

assert.equal(M(100).length, 4948);
assert.equal(Solve(100), 24477690);

let answer = TimeLogger.wrap('', () => Solve(2500));

console.log('Answer is', answer);
console.log('Done');
