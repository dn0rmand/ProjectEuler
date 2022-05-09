const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const TARGET = 1E9;
const ROUNDS = 1000;

class State {
    constructor(wins, probability) {
        this.wins = wins;
        this.probability = probability;
    }

    get key() {
        return this.wins;
    }

    * next() {
        yield new State(this.wins + 1, this.probability * 0.5);
        yield new State(this.wins, this.probability * 0.5);
    }
}

function getProbs() {
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State(0, 1));

    const tracer = new Tracer(true);
    for (let round = 0; round < ROUNDS; round++) {
        tracer.print(_ => `${ROUNDS-round} - ${states.size}`);
        newStates.clear();
        for (const state of states.values()) {
            for (const newState of state.next()) {
                const old = newStates.get(newState.key);
                if (old) {
                    old.probability += newState.probability;
                } else {
                    newStates.set(newState.key, newState);
                }
            }
        }
        [states, newStates] = [newStates, states];
    }

    tracer.clear();

    const results = [];
    for (const state of states.values()) {
        results[state.wins] = state.probability;
    }
    return results;
}

function calculate(probabilities, f) {
    let total = 0;

    for (let wins = 0, losts = ROUNDS; wins <= ROUNDS; wins++, losts--) {
        // (1 + 2f)^w * (1 - f)^(n - w)
        const v1 = Math.pow(1 + 2 * f, wins);
        const v2 = Math.pow(1 - f, losts);
        const outcome = v1 * v2;
        if (outcome >= TARGET) {
            total += probabilities[wins];
        }
    }

    return total;
}

function solve(probabilities) {
    let min = 0;
    let max = 1;
    let best = calculate(probabilities, 1 / 4);
    let value = calculate(probabilities, 1 / 2);
    if (best < value) {
        best = value;
        min = 1 / 2;
    } else {
        max = 1 / 4;
    }

    while (min < max) {
        const f = (min + max) / 2;
        if (f === min || f === max) {
            break;
        }

        value = calculate(probabilities, f);
        if (value === best) {
            break;
        } else if (value > best) {
            min = f;
            best = value;
        } else {
            max = f;
        }
    }

    return best.toFixed(12);
}

const probabilities = TimeLogger.wrap('Calculating Probabilities', _ => getProbs());

const answer = TimeLogger.wrap('', _ => solve(probabilities));
console.log(`Answer is ${answer}`);