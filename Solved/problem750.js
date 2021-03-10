const assert = require('assert')
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

function G(N) 
{
    function getPositions(N)
    {
        N = BigInt(N);
        const cards = [];
    
        for (let i = 1n; i <= N; i++) {
            const card = Number((3n**i) % (N+1n));
            cards[card] = Number(i);
        }
    
        return cards
    }

    const positions = getPositions(N);

    if (!positions) {
        return 0;
    }

    const $cost = [];

    function cost(min, max) 
    {
        if (min === max) {
            return 0
        }

        const key = (min * 1000) + max;
        if ($cost[key] !== undefined) {
            return $cost[key];
        }

        let value = Number.MAX_SAFE_INTEGER;

        for(let i = min; i < max; i++) {
            let c = Math.abs(positions[i]-positions[max]) + cost(min, i) + cost(i+1, max);
            value = Math.min(value, c);
        }

        $cost[key] = value;
        return value;
    }

    let total = cost(1, N);
    return total;
}

timeLogger.wrap('Testing', _ => {
    assert.strictEqual(G(6), 8);
    assert.strictEqual(G(16), 47);
    assert.strictEqual(G(18), 57);
    assert.strictEqual(G(28), 149);
    assert.strictEqual(G(30), 153); 
});

let answer = timeLogger.wrap('G(976)', _ => G(976, true));
console.log(`Answer is ${answer}`);
