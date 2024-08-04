const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

function time(enabled, description, action) {
    if (enabled) {
        return TimeLogger.wrap(description, action);
    } else {
        return action();
    }
}

function guess({ p, q }, lying, probability) {
    if (lying) {
        p *= 1 - probability;
        q *= probability;
    } else {
        p *= probability;
        q *= 1 - probability;
    }
    return { p, q };
}

function calculate(title, students, property, direction) {
    let states = [{ p: 1, q: 1 }];

    time(students.length > 20, `${title}: building states`, () => {
        const tracer = new Tracer(true, title);
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const newStates = [];
            for (const state of states.values()) {
                tracer.print(() => `${students.length - i}: ${newStates.length}`);
                const s1 = guess(state, false, student);
                const s2 = guess(state, true, student);
                newStates.push(s1, s2);
            }

            states = newStates;
        }
        tracer.clear();
    });

    time(students.length > 20, `${title}: Calculating pq and qp`, () => {
        states.forEach((s) => {
            s.pq = s.p / s.q;
            s.qp = s.q / s.p;
        });
    });

    time(
        students.length > 20,
        `${title}: Sorting by ${property} ${direction === 1 ? 'ascending' : 'descending'}`,
        () => {
            states.sort((s1, s2) => (s1[property] - s2[property]) * direction);
        }
    );

    return states;
}

function calculateProbability(N, formula, precision) {
    const students = Array.from({ length: N }, (_, n) => formula(n + 1) / 100).filter((v) => v !== 0.5);
    const studentsRight = students;
    const studentsLeft = students.splice(0, Math.floor(studentsRight.length / 2));

    const left = calculate('left', studentsLeft, 'pq', -1);
    const right = calculate('right', studentsRight, 'qp', 1);

    time(N === 51, 'Calculating Running sum', () => {
        right.reduce((p, s) => {
            s.p += p;
            return s.p;
        }, 0);
    });

    let correct = 0;

    time(N === 51, 'Doing product', () => {
        const tracer = new Tracer(true);
        const minQP = right[0].qp;
        for (let i = 0, idx = right.length - 1; i < left.length; i++) {
            tracer.print(() => `${left.length - i} - ${idx}`);

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
            correct += p * right[idx].p;
        }
        tracer.clear();
    });

    const answer = correct.toFixed(precision);
    return +answer;
}

assert.strictEqual(
    TimeLogger.wrap('', () => calculateProbability(4, (n) => n * 20, 3)),
    0.832
);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => calculateProbability(51, (n) => n + 24, 10));
console.log(`Answer is ${answer}`);
console.log('Actual is 0.9861343531');
