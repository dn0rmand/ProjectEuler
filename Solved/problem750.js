const assert = require('assert')
const timeLogger = require('tools/timeLogger');

function getPositions(N)
{
    const cards = [];

    let card = 1;

    for (let i = 1; i <= N; i++) {
        card = (card*3) % (N+1);
        cards[card] = i;
    }

    return cards
}

let $cost = [];
let positions = [];

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

function G(N) 
{
    positions = getPositions(N);
    $cost = [];

    return cost(1, N);
}

timeLogger.wrap('Testing', _ => {
    assert.strictEqual(G(6), 8);
    assert.strictEqual(G(16), 47);
    assert.strictEqual(G(18), 57);
    assert.strictEqual(G(28), 149);
    assert.strictEqual(G(30), 153); 
});

let answer = timeLogger.wrap('', _ => G(976));
console.log(`Answer is ${answer}`);
