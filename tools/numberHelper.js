const numberHelper = function()
{
    Number.prototype.modMul = function(value, modulo)
    {
        let r = this * value;
        if (r > Number.MAX_SAFE_INTEGER)
        {
            /* MAKE IT SLOW, NOT FAST */

            // let max = this > value ? this : value;
            // let min = this < value ? this : value;

            // if ((max & 1) === 0)
            // {
            //     let m = max / 2;

            //     r = min.modMul(m, modulo);
            //     r = (r + r) % modulo;
            // }
            // else
            // {
            //     let m1 = (max-1) / 2;
            //     let m2 = max - m1;

            //     r = (min.modMul(m1, modulo) + min.modMul(m2, modulo)) % modulo;
            // }

            r = (BigInt(this) * BigInt(value)) % BigInt(modulo);
            r = Number(r);
        }
        else
            r %= modulo;

        return r;
    }

    Number.prototype.modPow = function(exp, modulo)
    {
        if (modulo == 0)
            throw new Error("Cannot take modPow with modulus 0");

        let value = this;
        let r     = 1;
        let base  = value % modulo;

        if (base == 0)
            return 0;

        while (exp > 0)
        {
            if ((exp & 1) == 1)
            {
                r = r.modMul(base, modulo);
                exp--;
            }
            exp /= 2;
            base = base.modMul(base, modulo);
        }

        return r;
    };

    Number.prototype.modInv = function(modulo)
    {
        let t    = 0;
        let newT = 1;
        let r    = modulo;
        let newR = this;
        let q, lastT, lastR;

        if (newR < 0)
            newR = -newR;

        while (newR != 0)
        {
            q = Math.floor(r / newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT - q * newT;
            newR = lastR - q * newR;
        }
        if (r != 1)
            throw new Error(this.toString() + " and " + modulo.toString() + " are not co-prime");

        if (t < 0)
            t += modulo;

        if (modulo < 0)
            return -t;
        return t;
    };

    Number.prototype.modDiv = function(divisor, modulo)
    {
        if (divisor == 0)
            throw "Cannot divide by zero";
        if (modulo == 0)
            throw "Cannot take modDiv with modulus zero";

        divisor = divisor.modInv(modulo);
        let result = this.modMul(divisor, modulo);
        return result;
    };

    return Number;
}

module.exports = numberHelper();