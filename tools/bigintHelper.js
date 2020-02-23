const bigIntHelper = function()
{
    BigInt.ONE  = BigInt(1);
    BigInt.ZERO = BigInt(0);

    BigInt.prototype.gcd = function(b)
    {
        let a = this;
        if (a < b)
            [a, b] = [b, a];

        while (b !== 0n)
        {
            let c = a % b;
            a = b;
            b = c;
        }
        return a;
    }

    BigInt.prototype.divise = function(divisor, precision)
    {
        const g = this.gcd(divisor);
        
        let value = this / g;

        divisor /= g;
    
        const coef = 10 ** precision;
        const p1   = value % divisor;
        const a    = (value - p1) / divisor;
        const p2   = (p1 * BigInt(coef));
        const b    = (p2 - (p2 % divisor)) / divisor;
    
        return Number(a) + (Number(b) / coef);
    }

    BigInt.prototype.modMul = function(value, mod)
    {
        return (this * BigInt(value)) % BigInt(mod);
    }

    BigInt.prototype.modPow = function(exp, mod)
    {
        if (mod == 0)
            throw new Error("Cannot take modPow with modulus 0");

        let value = this;
        if (typeof(exp) !== 'bigint')
            exp = BigInt(exp);
        if (typeof(mod) !== 'bigint')
            mod = BigInt(mod);

        let r     = BigInt.ONE;
        let base  = value % mod;

        if (base == BigInt.ZERO)
            return BigInt.ZERO;

        while (exp > BigInt.ZERO)
        {
            if ((exp & BigInt.ONE) == BigInt.ONE)
                r = (r *base) % mod;
            exp  = exp >> BigInt.ONE;
            base = (base * base) % mod;
        }

        return r;
    };

    BigInt.prototype.modInv = function(n)
    {
        if (typeof(n) !== 'bigint')
            n = BigInt(n);

        let t    = BigInt.ZERO;
        let newT = BigInt.ONE;
        let r    = n;
        let newR = this;
        let q, lastT, lastR;

        if (newR < BigInt.ZERO)
            newR = -newR;

        while (newR != BigInt.ZERO)
        {
            q = r / newR;
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT - q * newT;
            newR = lastR - q * newR;
        }
        if (r != BigInt.ONE)
            throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");

        if (t < BigInt.ZERO)
            t += n;

        if (n < BigInt.ZERO)
            return -t;
        return t;
    };

    BigInt.prototype.modDiv = function(divisor, mod)
    {
        if (divisor == 0)
            throw "Cannot divide by zero";
        if (mod == 0)
            throw "Cannot take modDiv with modulus zero";

        if (typeof(divisor) !== 'bigint')
            divisor = BigInt(divisor);

        if (typeof(mod) !== 'bigint')
            mod = BigInt(mod);

        divisor = divisor.modInv(mod);

        let result = (this * divisor) % mod;

        return result;
    };

    return BigInt;
}

module.exports = bigIntHelper();