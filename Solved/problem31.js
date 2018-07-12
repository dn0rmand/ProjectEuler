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

let MAXCOIN = coins.length-1;
let memoize = {};

function change(pences, coin)
{    
    if (pences === 0)
        return 1;
    if (pences < 0)
        return 0;
    if (coin > MAXCOIN)
        return 0;
    if (coin === MAXCOIN)
        return 1;

    let k = pences + '-' + coin;
    let solutions = memoize[k];
    if (solutions !== undefined)
        return solutions;

        solutions = 0;
    let value = coins[coin];
    
    for(let count = 0; count*value <= pences; count++)
    {
        solutions += change(pences - (count*value), coin + 1);
    }

    memoize[k] = solutions;
    return solutions;
}

let solutionCount = change(200, 0);

console.log(solutionCount);