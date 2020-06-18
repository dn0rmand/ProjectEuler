const Tracer = require('tools/tracer');

` https://bonetblai.github.io/reports/AAAI08-ws10-ranking.pdf `

module.exports = (values, MODULO, trace) =>
{
    const n = values.length;
    const k = Math.ceil(Math.log2(n));
    const T = new Uint32Array(2 ** (k+1));

    const MODULO_N = MODULO ? BigInt(MODULO) : undefined;

    const k2= 2**k;

    let rank = 0;

    const tracer = new Tracer(500000, trace);
    for(let i = 0; i < n; i++)
    {
        tracer.print(_ => n-i);

        let digit = values[i]-1;
        let node  = k2 + digit;
        for(let j = 1; j <= k; j++)
        {
            if (node & 1)
                digit -= T[node-1];

            T[node]++;
            node >>= 1;
        }

        T[node]++;

        if (MODULO)
        {
            const r = rank * (n-i);

            if (r > Number.MAX_SAFE_INTEGER)
                rank = Number( (BigInt(rank)*BigInt(n-i)) % MODULO_N );
            else
                rank = r % MODULO;
        }
        else
            rank *= (n-i);

        rank += digit;
    }
    tracer.clear();
    if (MODULO)
        return (rank + 1) % MODULO;
    else
        return rank + 1;
};