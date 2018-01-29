// 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p)
const coins = {
    "1p": 1,
    "2p": 2,
    "5p": 5,
    "10p": 10,
    "20p": 20,
    "50p": 50,
    "£1": 100,
    "£2": 200
};

const coinNames = Object.keys(coins);

let changes = [

];

function equals(v1, v2)
{
    if (v1.length != v2.length)
        return false;
    for (let i = 0; i < v1.length; i++)
        if (v1[i] != v2[i])
            return false;
    return true;
}

function removeDuplicates(values)
{
    if (values.length < 2)
        return;
    for(let i = 1; i < values.length; i++)
    {
        let vi = values[i];
        let duplicate = false;
        for(let j = 0; j < i; j++)
        {
            let vj = values[j];
            if (equals(vi, vj))
            {
                duplicate = true;
                break;
            }
        }
        if (duplicate)
        {
            values.splice(i, 1);
            i--;
        }
    }
}

function flatten(solutions)
{    
    if (solutions.length === 0)
        return [];

    let values = [];
    let noDup = true;
    for(let i = 0; i < solutions.length; i++)
    {
        let change = solutions[i];
        let coin   = change.coin;

        if (coin === undefined) // flattened
        {
            values.push(change);
            continue;
        }

        let flat = flatten(change.options); 

        noDup = false;

        if (flat.length === 0)
        {
            values.push([coin]);
        }
        else
        {
            for(let j = 0; j < flat.length; j++)
            {
                let r = [coin];
                let f = flat[j];
                r.push(...f);
                r.sort();
                values.push(r);
            }
        }
    }

    if (noDup)
    {
        noDup = true;
    }
    else
        removeDuplicates(values);

    return values;
}

function change(pences)
{
    if (pences === 0)
        return [];

    let solutions = changes[pences];
    if (solutions !== undefined)
        return solutions;

    solutions = [];

    for(let i = 0; i < coinNames.length; i++)
    {
        let c = coinNames[i];
        let value = coins[c];
        if (value <= pences)
        {
            let options = change(pences-value);
            solutions.push({coin:c, options:options});
        }
    }

    if (change[pences] !== undefined)
        console.log('Weird!');

    solutions = flatten(solutions);

    changes[pences] = solutions;
    return solutions;
}

let solutions = change(200);

solutions = flatten(solutions);
console.log(solutions.length);