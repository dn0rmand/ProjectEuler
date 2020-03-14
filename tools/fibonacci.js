
module.exports = function fibonacci(n, modulo)
{
    const mul = (p1, p2) =>
    {
        let p = p1*p2;
        if (p > Number.MAX_SAFE_INTEGER)
        {
            if (modulo)
                p = Number((BigInt(p1)*BigInt(p2)) % BigInt(modulo));
            else
                throw "ERROR: number too big";
        }
        else if (modulo)
        {
            p %= modulo;
        }
        return p;
    }

    const add = (p1, p2) =>
    {
        let p = p1+p2;
        if (! modulo && p > Number.MAX_SAFE_INTEGER)
            throw "ERROR: number too big";

        return p % modulo;
    };

    const multiply = (m1, m2) =>
    {
        let result = [];

        result[0] = add(mul(m1[0], m2[0]) , mul(m1[1], m2[2]));
        result[1] = add(mul(m1[0], m2[1]) , mul(m1[1], m2[3]));
        result[2] = add(mul(m1[2], m2[0]) , mul(m1[3], m2[2]));
        result[3] = add(mul(m1[2], m2[1]) , mul(m1[3], m2[3]));

        return result;
    };

    const power = (m, pow) =>
    {
        let mm = undefined;

        if (pow === 1)
            return m;

        while (pow > 1)
        {
            if ((pow & 1) !== 0)
            {
                if (mm === undefined)
                    mm = m;
                else
                    mm = multiply(mm, m);

                pow--;
            }

            while (pow > 1 && (pow & 1) === 0)
            {
                pow /= 2;
                m =  multiply(m, m);
            }
        }

        if (mm !== undefined)
        {
            m = multiply(m, mm);
        }

        return m;
    };
    
    const matrix = [1, 1, 1, 0];
    const m = power(matrix, n);

    return { f0: m[1], f1: m[0] };
};
