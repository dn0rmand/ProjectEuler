// 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p)

const coins = [
    200,    
    100,
    50,
    20,
    10,
    5,
    2,
    1
];

let solutionCount = 0;

function change(pences, coin)
{    
    if (pences === 0)
    {
        solutionCount++;
        return;
    }
    if (pences < 0 || coin >= coins.length)
        return;

    let value = coins[coin];
    if (value === 1)
    {
        solutionCount++;
        return;
    }
    
    for(let count = 0; count*value <= pences; count++)
    {
        change(pences - (count*value), coin + 1);
    }
}

change(200, 0);

console.log(solutionCount);