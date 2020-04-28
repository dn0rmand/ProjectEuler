const assert = require('assert');

require('tools/numberHelper');

function differences(values, modulo)
{
    const result = [];
    for(let i = 1; i < values.length; i++)
    {
        let v = values[i] - values[i-1];
        while (v < 0 && modulo)
            v += modulo;
        result.push(v);
    }
    return result;
}

function isConstant(values)
{
    for(let i = 1; i < values.length; i++)
        if (values[i] !== values[i-1])
            return false;

    return true;
}

function reduce(values, modulo)
{
    let power = 0;
    
    while (! isConstant(values))
    {
        power++;
        values = differences(values, modulo);
    }

    if (values.length < 4)
        throw "No solution or not enough data";

    return { power , constant: values[0] };
}

function gcd(a, b)
{
    a = Math.abs(a);
    b = Math.abs(b);

    return a.gcd(b);
}

function simplify(equation)
{
    let d = 0;

    for(let v of equation)
    {        
        if (v === 0)
            continue;
        if (d === 0)
            d = v;
        else
            d = gcd(v, d);
        if (d === 1)
            return;
    }

    if (d !== 1)
    {
        for(let i = 0; i < equation.length; i++)
            equation[i] /= d;
    }
}

function ensurePositive(equation, index)
{
    if (equation[index] < 0)
    {
        for(let p = 0; p < equation.length; p++)
            equation[p] = -equation[p];
    }
}

function substract(eq1, eq2, factor)
{
    for(let j = 0; j < eq1.length; j++)
        eq1[j] -= (eq2[j] * factor);
}

function cloneEquations(equations)
{
    return equations.map(eq => [...eq]);
}

function solve(equations, power, maxPower, coefficients)
{
    equations.forEach((eq) => simplify(eq));

    if (maxPower === power)
    {
        let coef = undefined;
        for(let eq of equations)
        {            
            const C = { n: -eq[0], d: eq[power] };
            if (C.n === 0)
                C.d == 1;
            if (C.d < 0)
            {
                C.d = -C.d;
                C.n = -C.n;
            }

            if (! coef)
                coef = C;

            assert.equal(C.n, coef.n);
            assert.equal(C.d, coef.d);
        }
        coefficients[power] = coef;
        return coef;
    }

    // sort equations to have small A for this power first
    equations.sort((a, b) => Math.abs(a[power]) - Math.abs(b[power]));

    let ref = equations[0];
    ensurePositive(ref, power)

    const goodOnes = [];

    for(let i = 1; i < equations.length; i++)
    {
        let eq = equations[i];
        if (eq[power] === 0)
            continue;

        ensurePositive(eq, power);

        const factor = Math.floor(eq[power] / ref[power]);

        substract(eq, ref, factor);

        if (eq[power] === 0 && eq[power+1])
            goodOnes.push(eq);
    }

    if (power === maxPower)
    {
        if (goodOnes === 0)
        {
            throw "Unsolvable";
        }
    }
    else if (goodOnes.length > 0)
    {
        let coef = solve(goodOnes, power+1, maxPower, coefficients);
        if (coef)
        {
            let eq = equations[0];
            while (eq.length-1 > power)
            {
                let c = coefficients[eq.length-1];
                let v = eq.pop();
                for(let i = 0; i < eq.length; i++)
                    eq[i] = eq[i] * c.d;

                eq[0] = eq[0] - (v*c.n);
            }


            let c = { n: -eq[0], d: eq[power] };
            if (c.d < 0 && c.n < 0)
            {
                c.d = -c.d;
                c.n = -c.n;
            }
            assert.notEqual(c.d, 0);
            let d = gcd(c.n, c.d);
            c.n /= d;
            c.d /= d;
            coefficients[power] = c;
            return c;
        }
    }
    else
        throw "Unsolvable";
}

module.exports = {
    findPower : function(values, modulo)
    {
        let { power } = reduce(values, modulo);
        return power;
    },

    solve: function(values, modulo)
    {
        let { power } = reduce(values, modulo);

        const coefficients = [{ n: -values[0], d: 1}];
        const equations    = [];

        coefficients.length = power+1;

        const C = values[0]; // remove first row since used to get first coeficient
        for(let x = 1; x < values.length; x++)
        {
            let equation = [C - values[x]];

            for(let p = 1; p <= power; p++)
                equation.push(x.modPow(p, modulo));

            equations.push(equation);
        }

        if (solve(cloneEquations(equations), 1, power, coefficients))
        {
            for(let i = 0; i < coefficients.length; i++)
            {
                let c = coefficients[i];
                if (c === undefined)
                    throw "No solution";

                // if (c.d !== 1)
                // {
                //     for(let j = 0; j < coefficients.length; j++)
                //     {
                //         if (i === j) continue;
                //         if (coefficients[j] === undefined) continue;
                //         coefficients[j].n *= c.d;
                //         coefficients[j].d *= c.d;
                //     }
                // }
            }

            const formula = coefficients.reduce((a, c, index) => {
                if (c.n !== 0)
                {
                    let s = 1;
                    if (c.n > 0)
                        a.push('+')
                    else
                    {
                        s = -1;
                        a.push('-');
                    }
                    let b = '';
                    if (c.d !== 1)
                        b = `(${s*c.n}/${c.d})`;
                    else
                        b = `${s*c.n}`;

                    if (index === 0)
                        a.push(`${b}`);
                    else if (index === 1)
                        a.push(`${b}*X`);
                    else
                        a.push(`${b}*X^${index}`);
                }
                return a;
            }, []);

            return formula.join(' ');
        }
    },
};