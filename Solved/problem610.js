const { deromanize, romanize } = require("romans");
const timeLogger = require('tools/timeLogger');

const letters = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];

class State
{
    constructor(value, probability)
    {
        this.value = value;
        this.probability = probability;
    }

    getValidValues()
    {
        const valid = [];
        const r = romanize(this.value);
        for(const letter of letters) {
            const r1 = r+letter;
            const i  = deromanize(r1);
            const r2 = romanize(i);

            if (r1 === r2) {
                valid.push(i);
            }
        }
        return valid;
    }
}

function solve()
{
    const results = [];

    let states = new Map();
    let newStates = new Map();

    for(const letter of letters) {   
        const v = deromanize(letter);   
        states.set(v, new State(v, 0.14));
    }

    results[0] = 0.02;

    while(states.size)
    {
        newStates.clear();
        for(const state of states.values())
        {
            if (state.probability < 1E-16) {
                continue;
            }

            const validValues = state.getValidValues();
            const ratio = 0.02 + (validValues.length * 0.14);
            const prob = 0.14 / ratio;

            results[state.value] = (results[state.value] || 0) + ((state.probability * 0.02) / ratio);

            for(const value of validValues)
            {
                const newState = new State(value, state.probability * prob);
                const old = newStates.get(value);
                if (old === undefined) {
                    newStates.set(value, newState);
                } else {
                    old.probability += state.probability;
                }
            }
        }

        [states, newStates] = [newStates, states];
    }

    let result = 0;
    for(let i = 0; i < results.length; i++) {
        if (results[i] !== undefined) {
            result += i * results[i];
        }
    }

    return result.toFixed(8);
}

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`)