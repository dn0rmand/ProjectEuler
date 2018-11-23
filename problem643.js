// 2-Friendly
// ----------
// Problem 643 
// -----------
// Two positive integers a and b are 2-friendly when gcd(a,b)=2^t,t>0. For example, 24 and 40 are 2-friendly 
// because gcd(24,40)= 8 = 2^3 while 24 and 36 are not because gcd(24,36)=12=2^2*3 not a power of 2.

// Let f(n) be the number of pairs, (p,q), of positive integers with 1 ≤ p < q ≤ n such that p and q are 2-friendly. 
// You are given f(10^2)=1031 and f(10^6)=321418433 modulo 1000000007.

// Find f(10^11) modulo 1000000007.

const assert = require('assert');
const announce = require('tools/announce');
const primeHelper = require('tools/primeHelper')();

const MODULO    = 1000000007;
const MODULO_N  = BigInt(MODULO);
const MAX       = 1E11;
const MAX_PRIME = Math.floor(Math.sqrt(MAX))+1;

primeHelper.initialize(MAX_PRIME);

const MAX_CACHE = 2E9;

const ZERO  = BigInt(0);
const ONE   = BigInt(1);
const TWO   = BigInt(2);
const THREE = BigInt(3);

/*
class Mobius
{
    constructor()
    {
        console.log('precalculating lots of mobius');
        console.time('mobius');
        this.$mobius = new Uint8Array(MAX_CACHE);
        this.$mobius.fill(3);
        console.timeEnd('mobius');
        console.log('mobius loading done');
    }

    innerGet(index)
    {
        let v = this.$mobius[index];
        if (v === 2)
            return -1;
        else if (v === 1 || v === 0)
            return v;
        
        return undefined;
    }

    get(index)
    {
        // Special case
        if (index === 1)
            return 1;

        if (index < MAX_CACHE)
        {
            let v = this.innerGet(index);

            if (v !== undefined)
                return v;
        }

        let end = Math.floor(Math.sqrt(index))+1;
        let n = index;
        let v = 1;
        for (let p of primeHelper.primes())
        {
            if (p > n || p > end)
                break;
            if (n % p === 0)
            {
                v = -v;
                n /= p;
                if (n === 1)
                    break;
                if (n % p === 0)
                {
                    n = 1;
                    v = 0;
                    break;
                }
                let m = this.get(n);
                n = 1;
                v *= m;                
                break;
            }
        }
        if (n !== 1)
            v = -v;
        if (index < MAX_CACHE)
            this.set(index, v);

        return v;
    }

    set(index, value)
    {
        if (index < 0 || index >= MAX_CACHE)
            throw "Inalid index";
        if (value === undefined)
            value = 3;
        else if (value === -1)
            value = 2;
        else if (value != 1 && value != 0)
            throw "Invalid value";

        this.$mobius[index] = value;
    }
}

const mobius = new Mobius();

// let previous;
function f2(n, trace)
{
    let total = ZERO;

    let counts = new Map();

    for (let d = 1; d <= n; d++)
    {
        let m = mobius.get(d);
        if (m === 0)
            continue;
        let nd = Math.floor(n / d);
        counts.set(nd, (counts.get(nd) || 0) + m);
    }

    for (let nd of counts.keys())
    {
        let c = counts.get(nd);
        if (c === 0)
            continue;

        // nd = +nd;
        
        let v = (BigInt(nd) * BigInt(nd+1) * BigInt(c)) / TWO;

        total += v;
    }
    total -= ONE;
    // if (trace)
    // {
    //     console.log(n,'->',total, ':', (total-previous));
    //     previous = total;
    // }
    total = Number(total % MODULO_N);

    return total;
}

function f3(n, trace)
{
    // previous = BigInt(0);
    let values = [];

    let m = Math.floor(n / 2);
    while (m > 1)
    {
        values.push(m);
        m = Math.floor(m / 2);
    }

    let total = 0;
    let size  = values.length;
    
    while (values.length > 0)
    {
        m = values.pop();
        if (trace)
            console.log(values.length+1,'/',size,':',m);
        total = (total + f2(m)) % MODULO;
    }

    return total;
}
*/

const $f4 = new Map();

function f4(n)
{
    if (n === 0)
        return 1;

    let v = $f4.get(n);
    if (v !== undefined)
        return v;

    v = BigInt(n);

    v = (v * (v + THREE)) / TWO;
    let previous;
    let prev;
    let count;

    for (let k = 2; k <= n; k++)
    {
        let m = Math.floor(n/k);
        if (prev !== m)
        {
            if (previous !== undefined)
                v -= count*previous;
            prev = m;
            count= ONE;
            previous = f4(m);
        }
        else
            count++;
    }
    if (previous !== undefined)
        v -= count*previous;

    // a(n) = n(n+3)/2 - Sum(k = 2 to n, a([n/k]));

    $f4.set(n, v);
    return v;
}

function F(n, trace)
{
    let values = [];

    let m = Math.floor(n / 2);
    while (m > 1)
    {
        values.push(m);
        m = Math.floor(m / 2);
    }

    let total = 0;
    let size  = values.length;
    
    while (values.length > 0)
    {
        m = values.pop();
        if (trace)
            console.log(values.length+1,':',m);
        let v = (f4(m) - TWO) % MODULO_N;
        total = (total + Number(v)) % MODULO;
    }

    return total;
}

assert.equal(F(1E2), 1031);
assert.equal(F(1E6), 321418433);

let answer = F(MAX, true);

announce(643, "Answer is " + answer);
console.log('Answer is', answer);

/*

n/d = floor(n/d)

f(n) = sum {d=1..n} ( mu(d) * (n/d)  * (1 + n/d) )
f(2n)= sum {d=1..n} ( mu(d) * (2n/d) * (1+ 2n/d) ) +
       sum {d=1..n} ( mu(d+n) * (2n/(d+n)) * (1 + (2n/(d+n))) )
     = sum {d=1..n} 
 
(2n/d) * (1+ 2n/d) = (2*n*d + 4n^2) / d^2

(2n/(d+n)) * (1 + (2n/(d+n))) = 2n/(d+n) + 4n^2 / (d+n)^2
= (2n*(d+n) + 4n^2) / (d+n)^2
= (2*n*d + 6*n^2) / (d^2+2nd+n^2)


3 -> 3n : 3n
6 -> 11n : 8n
12 -> 45n : 34n
25 -> 199n : 154n
50 -> 773n : 574n

3 -> 3n : 3n
7 -> 17n : 14n
15 -> 71n : 54n
30 -> 277n : 206n
61 -> 1161n : 884n
122 -> 4555n : 3394n
244 -> 18175n : 13620n
488 -> 72547n : 54372n
976 -> 289643n : 217096n
1953 -> 1160097n : 870454n
3906 -> 4637631n : 3477534n
7812 -> 18550895n : 13913264n
15625 -> 74215309n : 55664414n
31250 -> 296849991n : 222634682n
62500 -> 1187362393n : 890512402n
125000 -> 4749468157n : 3562105764n
250000 -> 18997748543n : 14248280386n
500000 -> 75991039675n : 56993291132n

*/