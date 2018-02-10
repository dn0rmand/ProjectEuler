const bigInt = require('big-integer');

function *rootOf2()
{
    //
    // M+2N / M+N
    //

    let numerator   = bigInt(3);
    let denominator = bigInt(2);

    while(true)
    {
        yield { numerator: numerator, denominator: denominator };

        numerator = numerator.add(denominator).add(denominator);
        denominator = numerator.subtract(denominator); 
    }
}

let roots = rootOf2();
let ocurrences = 0;

for(let i = 0; i < 1000; i++)
{
    let v = roots.next().value;
    let digit1 = v.numerator.toString().length;
    let digit2 = v.denominator.toString().length;

    if (digit1 > digit2)
        ocurrences++;
}

console.log("Numerator with more digits than denominator happens " + ocurrences + " times");        

