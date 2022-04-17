const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MODULO = 4503599627370517n;
const START  = 1504170715041707n;

class Coins
{
    constructor()
    {
        this.first  = undefined;
        this.last   = undefined;

        let r    = MODULO;
        let t    = 0n;
        let newT = 1n;
        let newR = START;

        while (newR != 0n)
        {
            let x = newT;
            if (x > 0n)
                this.addCoin(x, newR);

            const q = r / newR;
            const lastT = t;
            const lastR = r;

            t = newT;
            r = newR;
            newT = lastT - q * newT;
            newR = lastR - q * newR;
        }

        if (t < 0n)
            t += MODULO;

        this.addCoin(t, 1n);
    }

    createCoin(n, value)
    {
        return {
            n: n,
            coin: value,
            m: ((n * START) - value) / MODULO
        };
    }

    addCoin(n, value)
    {
        const coin = this.createCoin(n, value);

        if (this.last === undefined)
        {
            this.first = coin;
            this.last  = coin;
        }
        else
        {
            this.last.next = coin;
            this.last = coin;
        }

        return coin;
    }

    insertCoin(after, n, value)
    {
        const coin = this.createCoin(n, value);

        coin.next  = after.next;
        after.next = coin;

        return coin;
    }

    addMissingCoins()
    {
        for (let current = this.first; current.next !== undefined; current = current.next)
        {
            const next = current.next;
            if (next.coin >= current.coin)
                continue;

            if ((next.n - current.n) <= (current.coin - next.coin))
            {
                for(let n = current.n+1n; n < next.n; n++)
                {
                    const coin = (n * START) % MODULO;
                    if (coin < current.coin)
                        current = this.insertCoin(current, n, coin);
                }
            }
        }

        return this;
    }

    addSomeMoreCoins()
    {
        let s0 = this.first;
        let s1 = s0.next;

        for(let s = s1.next; s !== undefined; s0 = s1, s1 = s, s = s.next)
        {
            if ((s.m + s0.m) % s1.m != 0)
            {
                let found = false;
                for (let m = 2n*s1.m - s0.m; m < s.m && ! found; m += s1.m)
                {
                    const M = m * MODULO;
                    for (let coin = s1.coin-1n; coin > s.coin; coin--)
                    {
                        if ((M + coin) % START === 0n)
                        {
                            const n = (M + coin) / START;
                            
                            s = this.insertCoin(s1, n, coin);
                            found = true;
                            break;
                        }
                    }
                }
            }
        }

        return this;
    }

    sumUp()
    {
        let total = 0n;
        for(let c = this.first; c != undefined; c = c.next)
            total += c.coin;
        return total;
    }
}

function solve()
{
    return new Coins().addMissingCoins().addSomeMoreCoins().sumUp();
}

const answer = timeLogger.wrap('', () => solve());

console.log(`Answer is ${answer}`);