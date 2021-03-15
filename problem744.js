const assert     = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer     = require('tools/tracer');

function f(n, p, trace)
{
    const start = {
        diff: 0,
        probability: 1
    };

    let states = new Map();

    states.set(0, start);

    let wins   = 0;
    let played = 0;
    let cards  = 2*n+2;

    const tracer = new Tracer(10000, trace);

    while (cards && states.size > 0) {

        tracer.print(_ => `${cards} - ${states.size} - ${wins.toFixed(10)}`);

        cards--;
        played++;

        const newStates = new Map();

        const add = newState => {
            if (newState.probability <= 1e-30) { 
                return; 
            }
            
            const max = (played + Math.abs(newState.diff))/2;

            if (max >= n) {
                wins += newState.probability;
            } else {
                const key = newState.diff;
                const old = newStates.get(key);
                if (old != null) {
                    old.probability += newState.probability;
                } else {
                    newStates.set(key, newState);
                }
            }
        }

        for(const state of states.values()) {            
            // pick non-red card

            const prob = (cards-1)/cards;

            // expert wins 

            add({
                diff: state.diff - 1,
                probability: state.probability * p * prob,
            });

            // player wins

            add({
                diff: state.diff + 1,
                probability: state.probability * (1-p) * prob,
            });

            // otherwise pick red card -> the game ends
        }

        states = newStates;
    }

    tracer.clear();

    return wins;// .toFixed(10);
}

assert.strictEqual(f(6, 0.5).toFixed(10), '0.2851562500');
assert.strictEqual(f(10, 3/7).toFixed(10), '0.2330040743');
assert.strictEqual(timeLogger.wrap('', _ => f(10000, 0.3).toFixed(10)), '0.2857499982');
assert.strictEqual(timeLogger.wrap('', _ => f(100000, 0.3, true).toFixed(10)), '0.2857178571');

console.log('Tests passed');

// const answer = timeLogger.wrap('', _ => f(1E11, 0.4999, true));
// console.log(`Answer is ${answer}`);