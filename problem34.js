const memoize = [

];

function factorial(n)
{
    if (n < 0)
        throw "Invalid argument";
    if (n < 2)
        return 1;

    let result = memoize[n];
    if (result === undefined)
    {
        result = n * factorial(n-1);
        memoize[n] = result;
    }
    return result;
}

function *getDigits(n)
{
    while (n > 0)
    {
        let d = n % 10;
        yield d;
        n = (n-d)/10;
    }
}

let MAX = 0; // MAX is the sum of the factorial of all digits
for(let i = 1; i < 10; i++)
    MAX += factorial(i);
    
//console.log('MAX = ' + MAX);
let total = 0;
for(let i = 3; i < MAX; i++)
{
    let digits = getDigits(i);
    let sum = 0;
    for(let d = digits.next(); !d.done; d = digits.next())
    {
        sum += factorial(d.value);
    }
    if (sum === i)
    {
        //console.log(i);
        total += i;
    }
}

console.log("Sum of numbers equal to the sum of their digits' factorials is " + total);