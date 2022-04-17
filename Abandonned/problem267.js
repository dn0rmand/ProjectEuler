const assert = require('assert');
const {
    TimeLogger: timeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');
const BigNumber = require('bignumber.js');

const TARGET = 1E9;
const ROUNDS = 1000;

function calculate(rounds, f) {
    let t = 1;
    let r = 0;

    while (r < rounds) {
        const x = t + t * f - t * f * f - t * f * f * f;
        r += 3;
    }

    console.log(t, '64269641510010810');

    const heads = new Array(Math.floor(rounds + 1));

    heads.fill(0); //, 0, rounds+1);
    heads[0] = 1;

    for (let round = 1; round <= rounds; round++) {
        const oh = [...heads];

        for (let h = round; h > 0; h--) {
            heads[h] += (oh[h - 1] * oh[round - h]) * 0.5;
        }

        heads[0] *= 0.5;
    }

    let total = 0;
    for (let h = 0; h <= rounds; h++) {
        total += heads[h] * heads[rounds - h];
    }
    return total.toString();
}

calculate(1000, 0.148);

function solve(target, rounds) {
    const $FACTORIALS = [1n, 1n];

    function factorial(n) {
        if ($FACTORIALS[n]) {
            return $FACTORIALS[n];
        };

        let total = 1n;
        for (let i = 2; i <= n; i++) {
            total *= BigInt(i);
            $FACTORIALS[i] = total;
        }
        return total;
    }

    const NUMERATOR = factorial(rounds);
    const DIVISOR = 2n ** BigInt(rounds);

    function calculate(f) {
        const C = Math.log10(target);
        const a = Math.log10(1 + 2 * f);
        const b = Math.log10(1 - f);

        const valid = (w, l) => {
            const A = w * a;
            const B = l * b;

            return A + B >= C;
        }

        let total = 0n;
        for (let w = 0; w <= rounds; w++) {
            const l = rounds - w;
            if (valid(w, l)) {
                const W = factorial(w);
                const L = factorial(l);

                total += NUMERATOR / (W * L);
            }
        }

        const res = total.divise(DIVISOR, 15);

        return res;
    }

    let min = 0;
    let max = 1;
    let middle = 0.5;
    let best = calculate(middle);

    while (true) {
        console.log(`${min} - ${middle} - ${max} -> ${best.toFixed(12)}`);
        let f1 = (min + middle) / 2;
        let f2 = (max + middle) / 2;
        let best1 = 0;
        let best2 = 0;

        if (f1 < middle && f1 > min) {
            best1 = calculate(f1);
        }
        if (f2 > middle && f2 < max) {
            best2 = calculate(f2);
        }

        if (best1 === 0 && best2 === 0) {
            break;
        }

        if (best1 === best2 && best1 === best) {
            break;
        }

        if (best1 > best2) {
            if (best1 >= best) {
                max = middle;
                middle = f1;
                best = best1;
            } else {
                min = f1;
                max = f2;
            }
        } else if (best2 > best1) {
            if (best2 >= best) {
                min = middle;
                middle = f2;
                best = best2;
            } else {
                min = f1;
                max = f2;
            }
        } else {
            min = f1;
            max = f2;
        }
    }

    return best.toFixed(12);
}

const answer = timeLogger.wrap('', _ => solve(TARGET, ROUNDS));
console.log(`Answer is ${answer}`);