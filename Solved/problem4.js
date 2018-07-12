const DIGITS = 3;

let MAX = Math.pow(10, DIGITS)-1;
//MAX *= MAX;
let MIN = Math.pow(10, DIGITS-1);
//MIN *= MIN;

function isPalindrom(value)
{
    value = value.toString();
    for(let i = 0, j = value.length-1 ; i <= j ; i++, j--)
    {
        if (value[i] !== value[j])
            return false;
    }
    return true;
}

let max = 0;
let product = '';

for(let v1 = MAX; v1 >= MIN; v1--)
{
    for(let v2 = MAX; v2 >= v1; v2--)
    {
        let value = v1*v2;
        if (value <= max) continue;

        if (isPalindrom(value))
        {
            max = value;
            product = v1 + 'x' + v2;
        }
    }
}

console.log('Max palindrom = ' + max + ' = ' + product);