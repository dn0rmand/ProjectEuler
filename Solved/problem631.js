// Constrained Permutations
// ------------------------
// Problem 631 
// -----------
// Let (p1p2…pk) denote the permutation of the set 1,...,k that maps pi↦i. 
// Define the length of the permutation to be k; note that the empty permutation () has length zero.

// Define an occurrence of a permutation p=(p1p2…pk) in a permutation P=(P1P2…Pn) to be a sequence 1≤t1<t2<⋯<tk≤n
// such that pi<pj if and only if Pti<Ptj for all i,j∈{1,...,k}.

// For example, (1243) occurs twice in the permutation (314625): once as the 1st, 3rd, 4th and 6th elements (3465), 
// and once as the 2nd, 3rd, 4th and 6th elements (1465)

// Let f(n,m) be the number of permutations P of length at most n such that there is no occurrence of the permutation 
// 1243 in P and there are at most m occurrences of the permutation 21 in P.

// For example, f(2,0)=3, with the permutations (), (1), (1,2) but not (2,1).

// You are also given that f(4,5)=32 and f(10,25)=294400

// Find f(10^18,40) modulo 1000000007

const assert = require('assert');
const bigInt = require('big-integer');
const MODULO = 1000000007;
const MAX    = bigInt(10).pow(18);

let _createdMore = false;

function F2(n, m, entries)
{
    function exist1243(state, index)
    {
        let length = state.length;
        if (length <= 3)
            return false;

        if (index < 2)
            return false;

        for (let i3 = index+1; i3 < length; i3++)
        {
            let v3 = state[i3];

            for (let i2 = index-1; i2 >= 1; i2--)
            {
                let v2 = state[i2];
                if (v2 > v3)
                    continue;

                for (let i1 = i2-1; i1 >= 0; i1--)
                {
                    let v1 = state[i1];
                    if (v1 < v2)
                        return true;
                }
            }
        }

        return false;
    }

    let result = [];
    result.stale = entries.stale;

    _createdMore = false;

    while (entries.length > 0)
    {
        let state = entries.pop();
        let index = state.length-1;
        let count21 = state[index];

        state[index] = n;

        let firstState = Array.of(...state, count21);

        let addedSome = false;

        while (index-- > 0)
        {
            state[index+1] = state[index];
            state[index] = n;

            let newCount = count21 + state.length - index - 1;

            if (newCount > m)
                break;

            if (! exist1243(state, index))
            {
                if (newCount < m)
                {
                    addedSome = true;
                    _createdMore = true;
                    let newState = Array.of(...state, newCount);
                    result.push(newState);
                }
                else
                    result.stale++;
            }
        }

        if (addedSome)
            result.push(firstState);
        else
            result.stale++;
    }

    return result;
}

function F(n, m, log)
{
    let total   = 4;
    let entries = [[1,2,0], [2,1,1]]; // last value is count of 2,1

    entries.stale = 0;

    let offset = 0;
    let x      = 2;

    n = bigInt(n);

    while (true)
    {
        x++;
        if (n.lt(x))
            break;

        entries = F2(x, m, entries);
        offset  = entries.stale + entries.length;
        total   = (total + offset) % MODULO;

        if (log === true)
        {
            console.log("F(" + x + "," + m + ") =", total, "- added", offset, "- active", entries.length, "- stale", entries.stale);

            if (! _createdMore)
            {
                let remainer = n.minus(x);
                let more = bigInt(offset).times(remainer).mod(MODULO).valueOf();
                total = (total + more) % MODULO;
                break;
            }
        }
    }

    return total;
}

//assert.equal(F(2, 0), 3);
assert.equal(F(bigInt(4), 5), 32);
assert.equal(F(bigInt(10), 25), 294400);

console.time(631);
let answer = F(MAX, 40, true);
console.timeEnd(631);
console.log("F(10^18, 40) =", answer);
