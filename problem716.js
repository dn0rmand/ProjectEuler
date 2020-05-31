const assert = require('assert');
const gcd = require('gcd');

`
w/h       1       2       3       4       5       6       7       8       9       10
  1       4      16      48     128     320     768    1792    4096    9216    20480
  2      16      58     160     398     940    2154    4840   10726   23524    51170
  3      48     160     408     952    2136    4696   10200   21976   47064   100312
  4     128     398     952    2106    4524    9598   20240   42530   89140   186438
  5     320     940    2136    4524    9376   19316   39752   81820  168432   346692
  6     768    2154    4696    9598   19316   38858   78432  158838  322444   655522
  7    1792    4840   10200   20240   39752   78432  155896  311824  626472  1262144
  8    4096   10726   21976   42530   81820  158838  311824  617770 1231684  2465630
  9    9216   23524   47064   89140  168432  322444  626472 1231684 2441568  4865404
 10   20480   51170  100312  186438  346692  655522 1262144 2465630 4865404  9662874
 `

 const compareArray = (a, b) => {
    for(let i = 0; i < a.length; i++)
    {
        let diff = a[i]-b[i];
        if (diff !== 0)
            return -diff; 
    }
    return 0;
};

function findRecurrence(F, size)
{
    function simplify(equation)
    {
        assert.equal(equation.length > 1, true);

        let g = gcd(equation[0], equation[1]);
        if (g === 1)
            return equation;

        for(let i = 2; i < equation.length; i++)
        {
            g = gcd(g, equation[i]);
            if (g === 1)
                return equation;
        }

        if (g === 0)
            return normalize(equation);

        for(let i = 0; i < equation.length; i++)
        {
            equation[i] /= g;
            if (equation[i] == 0)
                equation[i] = 0;
        }

        return normalize(equation);
    }

    function normalize(equation)
    {
        for(let i = 0; i < equation.length; i++)
        {
            if (equation[i] > 0 && equation[i] != 0)
                return equation;
            else if (equation[i] < 0 && equation[i] != 0)
                break;
        }

        for(let i = 0; i < equation.length; i++)
        {
            if (equation[i] == 0)
                equation[i] = 0;
            else
                equation[i] = -equation[i];
        }

        return equation;
    }

    const equations = [];
    for(let i = F.length-1; i > size; i--)
    {
        // 0 = A . F[i-1] + B . F[i-2] - F[i]

        const equation = [];
        for(let j = 1; j <= size; j++)
            equation.push(F[i-j]);
        equation.push(-F[i]);
        equations.push(equation);
    }

    while (equations[1][0] !== 0)
    {
        for(let j = equations.length-1; j > 0; j--)
        {
            let eq1 = equations[j];
            let eq2 = equations[j-1];
            eq2 = eq2.map((v, idx) => v - eq1[idx]);                
            equations[j-1] = simplify(eq2);
        }
        equations.sort(compareArray);
    }
}

 const data = [16, 58, 160, 398, 940, 2154, 4840, 10726, 23524, 51170];

 findRecurrence(data, 3)