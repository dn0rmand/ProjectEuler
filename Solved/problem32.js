

const pandigitals = [];

function buildPandigitals(current, used, length)
{
    if (length >= 9)
    {
        pandigitals.push(current);
        return;
    }

    for(let c = 1 ; c <= 9; c++)
    {
        if (used[c] === 1)
            continue;
        used[c] = 1;
        buildPandigitals((current * 10) + c, used, length+1);
        used[c] = 0;
    }
}

function makeAllProducts()
{
    let totalSum = 0;
    let products = new Map();
    let count = 0;
    for(let i = 0; i < pandigitals.length; i++)
    {
        let value = pandigitals[i];
        let s = value.toString();
        for(let l1 = 1; l1 <= 9-2; l1++)
        {
            let p1 = Math.pow(10, l1);
            let v1 = value % p1;

            let value2 = (value-v1) / p1; 
            for (let l2 = 1; l2+l1 <= 9-1; l2++)
            {
                let p2 = Math.pow(10, l2);

                let v2 = value2 % p2;
                let v3 = (value2 - v2) / p2;

                let prod = v1*v2;

                if (prod === v3)
                {
                    if (prod === 7254)
                    {
                        console.log('Validation: ' + v1 + 'x' + v2 + '=' + prod);
                    }

                    if (! products.has(prod))
                        totalSum += prod;

                    products.set(prod, 1);
                }
            }
        }
    }
    return totalSum;
}

buildPandigitals(0, {}, 0);
let result = makeAllProducts();
console.log('Sum of products whose multiplicand/multiplier/product is  1 through 9 pandigital = ' + result);
