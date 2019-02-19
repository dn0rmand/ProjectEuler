namespace problem2
{
    const MAX : number = 4000000;

    function fibonacci() : number
    {
        let term1 : number = 1;
        let term2 : number = 1;
        let sum   : number = 0;

        while (term2 < MAX)
        {
            if ((term2 & 1) === 0)
            {
                sum += term2;
            }

            const newterm = term2 + term1;
            term1 = term2;
            term2 = newterm;
        }

        return sum;
    }

    const result : number = fibonacci();

    console.log('Problem 2 result is', result);
}