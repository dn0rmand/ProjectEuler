function solve()
{
    function makeKey(state)
    {
        return `${state.sum}:${state.digits.join('')}`;
    }

    let states = [ {
        sum: 0,
        digits: [0,0,0],
        count: 1,
        len: 0
    }];

    while(states[0].len != 20)
    {
        let newStates = {};
        for(let state of states)
        {
            let start = state.len == 19 ? 1 : 0;

            for(let d = start; d < 10; d++)
            {
                let n = {
                    sum: state.sum - state.digits[0] + d,
                    digits: [state.digits[1], state.digits[2], d],
                    count: state.count,
                    len: state.len+1
                };

                if (n.sum <= 9)
                {
                    let k = makeKey(n);
                    if (newStates[k])
                        newStates[k].count += n.count;
                    else
                        newStates[k] = n;
                }
            }
        }

        states = Object.values(newStates);
    }

    let total = 0;
    for (let state of states)
        total += state.count;

    if (total > Number.MAX_SAFE_INTEGER)
        throw "Need bigint";

    return total;
}

let answer = solve();
console.log('Answer is', answer);
