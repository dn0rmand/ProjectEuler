function findMin(MAX)
{
    let result = MAX-1;
    let valid = false;

    while(!valid)
    {
        result++;
        valid = true;
        for(let i = 2; i <= MAX; i++)
        {
            if ((result % i) !== 0)
            {
                valid = false;
                break;
            }
        }
    }
    console.log(result + " is the smallest positive number that is evenly divisible by all of the numbers from 1 to " + MAX);
    return result;
}

let v1 = findMin(10);
if (v1 != 2520)
    console.log('Test failed');

let v2 = findMin(20);