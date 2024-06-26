// Optimum polynomial
// ------------------
// Problem 101
// -----------
// If we are presented with the first k terms of a sequence it is impossible to say with certainty the value of
// the next term, as there are infinitely many polynomial functions that can model the sequence.

// As an example, let us consider the sequence of cube numbers. This is defined by the generating function, 
// un = n^3: 1, 8, 27, 64, 125, 216, ...

// Suppose we were only given the first two terms of this sequence. Working on the principle that "simple is best" we
// should assume a linear relationship and predict the next term to be 15 (common difference 7).
// Even if we were presented with the first three terms, by the same principle of simplicity, a quadratic relationship
// should be assumed.

// We shall define OP(k, n) to be the nth term of the optimum polynomial generating function for the first k terms of a
// sequence. It should be clear that OP(k, n) will accurately generate the terms of the sequence for n ≤ k, and
// potentially the first incorrect term (FIT) will be OP(k, k+1); in which case we shall call it a bad OP (BOP).

// As a basis, if we were only given the first term of sequence, it would be most sensible to assume constancy;
// that is, for n ≥ 2, OP(1, n) = u1.

// Hence we obtain the following OPs for the cubic sequence:

// OP(1, n) = 1	            1, [1], 1, 1, ...
// OP(2, n) = 7n−6	        1, 8, [15], ...
// OP(3, n) = 6n^2−11n+6    1, 8, 27, [58], ...
// OP(4, n) = n^3	        1, 8, 27, 64, 125, ...
// Clearly no BOPs exist for k ≥ 4.

// By considering the sum of FITs generated by the BOPs (indicated in red above), we obtain 1 + 15 + 58 = 74.

// Consider the following tenth degree polynomial generating function:

// un = 1 − n + n^2 − n^3 + n^4 − n^5 + n^6 − n^7 + n^8 − n^9 + n^10

// Find the sum of FITs for the BOPs.

const assert = require('assert');

function format(values)
{
    let power = values.length-1;
    let s = "un =";
    let first = true;

    for (let index = values.length; index > 0; index--)
    {
        let c = values[index-1];

        s += " ";
        let m = '*';

        if (first)
        {
            if (power === 0)
                s += c;
            else if (c !== 1)
                s += c;
            else
                m = '';
        }
        else if (c >= 0)
        {
            if (c === 1 && power > 0)
            {
                m = '';
                s += '+ ';
            }
            else
                s += "+ "+c;
        }
        else if (c === -1 && power > 0)
        {
            s += "- ";
            m = '';
        }
        else
            s += "- "+(-c);

        if (power > 1)
            s += m + "n^" + power;
        else if (power > 0)
            s += m + "n";

        power--;
        first = false;
    }

    return s;
}

function calculate(x, values)
{
    let X = 1;
    let V = 0;

    for (let v of values)
    {
        V += (X * v);
        X = X*x;
    }

    return V;
}

function *UN()
{
    let factors = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1];
    let x = 0;

    while (true)
    {
        let v = calculate(++x, factors);

        if (v > Number.MAX_SAFE_INTEGER)
            throw "ERROR ... too big";

        yield v;
    }
}

function OP(n)
{
    let maxCount = n;

    function reduce(ref, state)
    {
        for (let i = 0; i < maxCount; i++)
        {
            if (state.factors[i] < ref.factors[i])
                return false;
        }
        state.value -= ref.value;
        for (let i = 0; i < maxCount; i++)
        {
            let v = ref.factors[i];
            if (v === 0)
                continue;
            state.factors[i] -= v;
            if (state.factors[i] === 0)
                state.count--;
        }
        if (state.count === 1)
        {
            for (let i = 0; i < maxCount; i++)
            {
                if (state.factors[i] !== 0)
                {
                    if (state.value % state.factors[i] === 0)
                    {
                        state.value /= state.factors[i];
                        state.factors[i] = 1;
                    }
                }
            }
        }
        return true;
    }

    function apply(ref, state)
    {
        if (state.count === 1)
            return;

        for (let i = 0; i < maxCount; i++)
        {
            if (ref.factors[i] !== 0)
            {
                assert.equal(ref.factors[i], 1);

                if (state.factors[i] !== 0)
                {
                    state.value -= state.factors[i] * ref.value;
                    state.factors[i] = 0;
                    state.count--;
                }
                break; // There's only 1!
            }
        }

        if (state.count === 1)
        {
            for (let i = 0; i < maxCount; i++)
            {
                let v = state.factors[i];
                if (v !== 0)
                {
                    if (v !== 1)
                    {
                        assert.equal(v > 1, true);
                        assert.equal(state.value % v, 0);

                        state.value /= v;
                        state.factors[i] /= v;
                    }

                    break;
                }
            }
        }
    }

    let states = [];
    let x = 1;

    for (let u of UN())
    {
        let state = {
            value: u,
            factors: [],
            count: maxCount
        };
        let X = 1;
        for (let f = 0; f < maxCount; f++)
        {
            state.factors.push(X);
            X = X*x;
        }
        states.push(state);
        x++;
        if (x > n)
            break;
    }

    for (let ref = 0; ref < states.length; ref++)
    {
        for (let state = ref+1; state < states.length; state++)
        {
            while (reduce(states[ref], states[state])) ;
        }
    }

    let allSolved = true;
    for (let ref = states.length-1; ref >= 0; ref--)
    {
        let refState = states[ref];
        if (refState.count === 1)
        {
            for (let s = ref-1; s >= 0; s--)
            {
                apply(refState, states[s]);
            }
        }
        else
            allSolved = false;
    }

    assert.equal(allSolved, true);

    let solutions = [];

    for (let state of states)
    {
        for (let i = 0; i < maxCount; i++)
        {
            let factor = state.factors[i];
            if (factor !== 0)
            {
                assert.equal(factor, 1);
                assert.equal(solutions[i], undefined);

                solutions[i] = state.value;
                break;
            }
        }
    }
    for (let i = 0; i < maxCount; i++)
        assert.notEqual(solutions[i], undefined);

    return solutions;
}

function OPn(N)
{
    let solutions = OP(N);

    let x = 1;

    if (N === 11)
    {
        let formula = format(solutions);
        console.log(formula);
    }

    for (let u of UN())
    {
        let n = calculate(x, solutions);

        if (n !== u)
        {
            assert(x > N);
            return n;
        }

        x++;

        if (x > 15)
            break;
    }
}

// Verification that it returns the same formula as the input
assert.equal(OPn(11), undefined);

let answer = 0;

for (let n = 1; n < 11; n++)
{
    answer += OPn(n);
}

console.log('Answer is', answer);
