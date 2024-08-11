const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function calculate(students, isPQ) {
    let states = [{ p: 1, q: 1, count: 1 }];

    for (let i = 0; i < students.length; i++) {
        const { p, q } = students[i];
        const newStates = [];
        for (const { p: p0, q: q0 } of states.values()) {
            newStates.push(
                { p: p0 * p * p, q: q0 * q * q },
                { p: p0 * q * q, q: q0 * p * p },
                { p: 2 * p0 * p * q, q: 2 * q0 * p * q }
            );
        }

        states = newStates;
    }

    if (isPQ) {
        states.forEach((s) => {
            s.pq = s.p / s.q;
        });
    } else {
        states.forEach((s) => {
            s.qp = s.q / s.p;
        });
    }

    const compare = isPQ ? (s1, s2) => s2.pq - s1.pq : (s1, s2) => s1.qp - s2.qp;

    states.sort(compare);

    return states;
}

function calculateProbability(N, formula, precision) {
    const students = Array.from({ length: N }, (_, n) => {
        const f = formula(n + 1);
        return { p: f / 100, q: (100 - f) / 100 };
    }).filter(({ p, q }) => p < q);

    const studentsRight = students;
    const studentsLeft = students.splice(0, Math.floor(studentsRight.length / 2));

    const left = calculate(studentsLeft, true);
    const right = calculate(studentsRight, false);

    right.reduce((sum, s) => (sum = s.sum = sum + s.p), 0);

    let correct = 0;

    const minQP = right[0].qp;
    for (let i = 0, idx = right.length - 1; i < left.length; i++) {
        const { p, pq } = left[i];
        if (pq < minQP) {
            break;
        }
        while (idx >= 0 && pq < right[idx].qp) {
            idx--;
        }
        if (idx < 0) {
            break;
        }
        let x = idx;
        while (x >= 0 && pq === right[x].qp) {
            correct += (p * right[x].p) / 2;
            x--;
        }
        if (x >= 0) {
            correct += p * right[x].sum;
        }
    }

    const answer = correct.toFixed(precision);
    return answer;
}

assert.strictEqual(
    calculateProbability(4, (n) => n * 20, 3),
    '0.832'
);

assert.strictEqual(
    calculateProbability(31, (n) => n + 49 - 15, 10),
    '0.8451622395'
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => calculateProbability(51, (n) => n + 24, 10));
console.log(`Answer is ${answer}`);
