const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

function buildSet()
{
    let set = [];

    for (let i = 1; i <= 100; i++)
        set.push(i*i);

    return set;
}

function solve(set, size)
{
    let expected = [10,12,14,18,21,25,27,29];

    function makeKey(sum, length)
    {
        let dec = length / 1000;
        let key = sum + dec;

        return key;
    }

    let states = new Map();
    let remaining = set.length;
    let found = new Map();

    for (let i = 0; i < set.length; i++, remaining--)
    {
        process.stdout.write(`\r${ i } - ${ states.size } `);

        let value     = set[i];
        let nextStates= new Map();

        nextStates.set(makeKey(value, 1), { sum: value, length: 1, count: 1 });

        for (let [key, state] of states)
        {
            if (state.length > size || state.length+remaining < size) // won't do
                continue;

            // Copy old state to new collection for when we don't add a number
            let old = nextStates.get(key);
            if (old !== undefined)
                old.count += state.count;
            else
                nextStates.set(key, {sum: state.sum, length: state.length, count: state.count });

            // Add number if length isn't going to exceed size and if there is a change to actually reach size
            if ((state.length+remaining) >= size)
            {
                let s = state.sum + value;
                let l = state.length + 1;

                if (l === size)
                {
                    found.set(s , (found.get(s) || 0) + state.count);
                }
                else
                {
                    let k = makeKey(s, state.length + 1);
                    let old = nextStates.get(k);
                    if (old !== undefined)
                        old.count += state.count;
                    else
                        nextStates.set(k, { sum: s, length: l, count: state.count });
                }
            }
        }

        states = nextStates;
    }

    process.stdout.write('\r\n');

    let total = 0;

    found.forEach((count, sum) => {
        if (count === 1)
            total += sum;
    });

    return total;
}

assert.equal(solve([1,3,6,8,10,11], 3), 156);

let answer = timeLog.wrap('', () => {
    let bigSet = buildSet();
    let answer = solve(bigSet, 50);
    return answer;
});

console.log('Answer is', answer);
