const timeLogger = require('tools/timeLogger');
const assert = require('assert');

const WIN = 0.6;
const LOST= 0.4;
const TARGET = 1E12;

function solve(target, maxRounds)
{
    const $inner = [];

    function get(gold, rounds)
    {
        const a = $inner[gold];
        if (a) {
            return a[rounds];
        }
    }

    function set(gold, rounds, best) 
    {
        let a = $inner[gold];
        if (! a) {
            $inner[gold] = a = [];
        }
        a[rounds] = best;
    }

    function inner(gold, rounds) 
    {
        if (gold >= target) {
            return 1;
        }
        if (gold === 0 || rounds === 0) {
            return 0;
        }
                
        let best = get(gold, rounds);
        if (best !== undefined) {
            return best
        }

        if (((2**rounds) * gold) < target) {
            set(gold, rounds, 0);
            return 0;
        }

        best = 0;

        for(let bet = gold; bet > 0; bet -= 1) 
        {
            const win  = inner(gold+bet, rounds-1);
            if (win === 0) {
                break;
            }
            const lost  = inner(gold-bet, rounds-1);
            const P = lost * LOST + win * WIN;
            if (P >= best) {
                best = P;
                if (P >= 1) {
                    break;
                }
            }
        }

        set(gold, rounds, best);
        return best;
    }

    const answer = inner(1, maxRounds);
    return answer.toFixed(10);
}

// assert.strictEqual(solve(10, 10), '0.2244713472');
// assert.strictEqual(solve(50, 100), '0.2687526424');
assert.strictEqual(solve(1000, 50), '0.0373963699');

console.log('Tests passed');

// const answer = timeLogger.wrap('', _ => solve(100000, 1000));
// console.log(`Answer is ${answer}`);