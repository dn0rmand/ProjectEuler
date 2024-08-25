const assert = require('assert');
const { TimeLogger, FakePreciseNumber: PreciseNumber } = require('@dn0rmand/project-euler-tools');

const ZERO = PreciseNumber.Zero;
const ONE = PreciseNumber.One;
const TWO = PreciseNumber.create(2, 1);
const HALF = ONE.divide(TWO);

const MAX_TARGET = 100;

function solve(target) {
    const $memoize = [];

    function inner(p1, p2) {
        if (p2 >= target) {
            return ONE;
        } else if (p1 >= target) {
            return ZERO;
        } else {
            const key = p1 * 200 + p2;
            if ($memoize[key] !== undefined) {
                return $memoize[key];
            }

            let max = ZERO;
            let bet = 1;
            let prob = ONE;
            while (true) {
                const win2 = HALF.divide(prob);
                const lose2 = ONE.minus(win2);

                const a = inner(p1 + 1, p2 + bet)
                    .times(HALF)
                    .times(win2);
                const b = inner(p1, p2 + bet)
                    .times(HALF)
                    .times(win2);
                const c = inner(p1 + 1, p2)
                    .times(HALF)
                    .times(lose2);

                const pp = a
                    .plus(b)
                    .plus(c)
                    .divide(ONE.minus(HALF.times(lose2)));

                if (pp > max) {
                    max = pp;
                }

                if (p2 + bet >= target) {
                    break;
                }
                bet *= 2;
                prob = prob.times(TWO);
            }

            $memoize[key] = max;
            return max;
        }
    }

    const best = inner(0, 0).times(HALF) + inner(1, 0).times(HALF);

    return best.valueOf(10).toFixed(8);
}

assert.strictEqual(solve(10), '0.67006457');
assert.strictEqual(solve(20), '0.72900976');

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX_TARGET));
console.log(`Answer is ${answer}`);
