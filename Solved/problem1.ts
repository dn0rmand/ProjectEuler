namespace problem1
{
    function getMultipleSum(MAX : number, factor : number, notFactor : number = 0) : number
    {
        let sum : number = 0;
        let value : number = MAX;
        while (--value > 0)
        {
            if ((value % factor) === 0)
                break;
        }
        while (value >= factor)
        {
            if (notFactor === 0 || (value % notFactor) !== 0)
                sum += value;

            value -= factor;
        }

        return sum;
    }

    function solve(max : number) : void
    {
        const sum1 = getMultipleSum(max, 5);
        const sum2 = getMultipleSum(max, 3, 5);

        console.log("Result for", max, "is", (sum1+sum2));
    }

    solve(10);
    solve(1000);
}