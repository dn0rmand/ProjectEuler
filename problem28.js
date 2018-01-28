function getValue(x,y) 
{
    var res;

    if (x > -y) 
    {
        if (x >= y) 
        {
            x <<= 1;
            res = x*x - y;
        } 
        else 
        {
            y <<= 1;
            res = y*y + x;
        }
    } 
    else if (x < y) 
    {
        x <<= 1;
        res = -2*x + x*x + y;
    } 
    else 
    {
        y <<= 1;
        res = y*y -x;
    }
    return res+1;
}

function getDiagonalsSum(size)
{
    let sum = 0;

    size = ((size-1) / 2);
    for (let i = 0; i <= size; i++)
    {
        sum += getValue(i, i);

        if (i !== 0)
        {
            sum += getValue(-i,  i)
            sum += getValue( i, -i)
            sum += getValue(-i, -i)
        }
    }
    return sum;
}

let sum;

sum = getDiagonalsSum(5);
console.log('Diagonal sum for a size of 5x5 is ' + sum);
sum = getDiagonalsSum(1001);
console.log('Diagonal sum for a size of 1001x1001 is ' + sum);