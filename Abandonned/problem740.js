const assert = require('assert');
const {
    TimeLogger: timeLogger,
} = require('@dn0rmand/project-euler-tools');

function bruteQ(n) {
    const used = Array(n).fill(2);

    function makeKey(player) {
        let key = 0;
        for (let i = 0; i < player; i++)
            key += used[i];

        for (let i = player; i < used.length; i++)
            key = (key * 4) + used[i];

        return key;
    }

    const $inner = new Map();

    function inner(remaining, player, pick) {
        if (remaining === 2) {
            if (used[n - 1] !== 0)
                return 1;
            else
                return 0;
        }

        const k = makeKey(player);

        const ways = remaining - used[player];

        let odds = $inner.get(k);
        if (odds !== undefined)
            return odds / ways;

        odds = 0;

        for (let i = 0; i < n; i++) {
            if (used[i] === 0 || i === player) continue; // 

            const options = used[i];

            used[i]--;

            if (pick)
                odds += options * inner(remaining - 1, player + 1, 0);
            else
                odds += options * inner(remaining - 1, player, 1);

            used[i]++;
        }

        $inner.set(k, odds);

        return odds / ways;
    }

    const answer = inner(2 * n, 0, 0, used);

    return answer;
}

function q(n) {
    function count(set1, set2) {
        if (set2 === undefined) {
            if (set1 < 2)
                throw "ERROR";

            return (set1 * (set1 - 1)) / 2;
        } else {
            if (set1 < 1 || set2 < 1)
                throw "ERROR";

            return set1 * set2;
        }
    }

    function inner(player, remaining) {
        let totalWays = 0;

        function process(odds, ways) {
            if (ways <= 0)
                throw "ERROR";

            totalWays += ways;
            return odds * ways;
        }

        if (remaining < 0) {
            throw "ERROR";
        }

        if (player === 1) {
            return (remaining > 0 ? 1 : 0);
        }

        let odds = 0;

        const backCards = (2 * player) - remaining;

        // both the player's cards are in the hat
        if (remaining >= 2) {
            // player play 1 forward and 1 back

            if (backCards >= 1 && remaining >= 3)
                odds += process(inner(player - 1, remaining - 3), count(remaining - 2, backCards));

            // player plays both back

            if (backCards >= 2)
                odds += process(inner(player - 1, remaining - 2), count(backCards));

            // player plays both forward

            if (remaining >= 4)
                odds += process(inner(player - 1, remaining - 4), count(remaining - 2));
        }

        // one of the player's cards is still in the hat

        if (backCards >= 1) {
            // player play 1 forward and 1 back

            if (backCards >= 2 && remaining >= 2)
                odds += process(inner(player - 1, remaining - 2), count(remaining - 1, backCards - 1));

            // player plays both back

            if (backCards >= 3 && remaining >= 1)
                odds += process(inner(player - 1, remaining - 1), count(backCards - 1));

            // player plays both forward

            if (remaining >= 3)
                odds += process(inner(player - 1, remaining - 3), count(remaining - 1));
        }

        // none of the player's cards are in the hat 

        if (backCards >= 2) {
            // player play 1 forward and 1 back

            if (backCards > 2 && remaining >= 1)
                odds += process(inner(player - 1, remaining - 1), count(remaining, backCards - 2));

            // player plays both back

            if (backCards >= 4)
                odds += process(inner(player - 1, remaining), count(backCards - 2));

            // player plays both forward

            if (remaining >= 2)
                odds += process(inner(player - 1, remaining - 2), count(remaining));
        }

        if (totalWays === 0)
            throw "ERROR";
        else
            odds /= totalWays;

        return odds;
    }

    const odds = inner(n, 2 * n);
    return odds;
}

function bruteSecretSanta(n) {
    const used = new Array(n).fill(0);

    function inner(remaining, player) {
        if (remaining === 1) {
            return used[n - 1] ? 0 : 1;
        }

        let ways = 0;
        let odds = 0;

        for (let i = 0; i < n; i++) {
            if (used[i] || i === player) continue; // 

            used[i] = 1;
            ways++;
            odds += inner(remaining - 1, player + 1);
            used[i] = 0;
        }

        return odds / ways;
    }

    const answer = inner(n, 0);

    return answer;
}

function secretSanta(n) {
    function inner(player, remaining) {
        if (remaining < 0) {
            throw "ERROR";
        }

        if (player === 1) {
            return (remaining === 0 ? 0 : 1);
        }

        const played = n - player;
        const unplayed = n - played;
        const otherCards = unplayed - remaining;

        // player plays forward

        let odds1 = 0,
            odds2 = 0;

        if (remaining > 0) {
            // player's card is in the hat
            odds1 += (remaining > 1 ? inner(player - 1, remaining - 2) : inner(1, 0)) / 2;
            // player's cards is NOT in the hat
            odds1 += inner(player - 1, remaining - 1) / 2;
        } else
            odds1 += inner(1, 0);

        // player plays back
        odds2 += (remaining > 0 ? inner(player - 1, remaining - 1) : inner(1, 0)) / 2;
        // player's cards is NOT in the hat
        odds2 += inner(player - 1, remaining) / 2;

        return (odds1 * remaining + odds2 * otherCards) / unplayed;
    }

    const odds = inner(n, n);
    return odds;
}

console.log(bruteSecretSanta(5), secretSanta(5));
console.log(bruteSecretSanta(3), secretSanta(3));
console.log(bruteSecretSanta(10), secretSanta(10));

assert.strictEqual(bruteQ(5).toFixed(10), '0.2476095994');
assert.strictEqual(bruteQ(3).toFixed(10), '0.3611111111');
// assert.strictEqual(timeLogger.wrap('q(7)', _ => q(7).toFixed(10)), '0.1947307682');
// assert.strictEqual(timeLogger.wrap('q(10)', _ => q(10).toFixed(10)), '0.1480206355');
// assert.strictEqual(timeLogger.wrap('q(11)', _ => q(11).toFixed(10)), '0.1371658155');
// assert.strictEqual(timeLogger.wrap('q(12)', _ => q(12).toFixed(10)), '0.1278311443');
// assert.strictEqual(timeLogger.wrap('q(13)', _ => q(13).toFixed(10)), '0.1197146761');
// assert.strictEqual(timeLogger.wrap('q(14)', _ => q(14).toFixed(10)), '0.1125898661');
// assert.strictEqual(timeLogger.wrap('q(15)', _ => q(15).toFixed(10)), '0.1062833841');
// assert.strictEqual(timeLogger.wrap('q(20)', _ => q(20).toFixed(10)), '0.0831594016');

// console.log('Tests passed');
// console.log(q(100));

`
So normal secret santa could be solved with a recursive memoized 
OddsFail(playersRemaining, namesRemainingAfterCurrentPlayer)
with four paths inside the method:
    Current player is one of those whose name is remaining
        He picks another player whose name was remaining 
            OddsFail(playersRemaining-1, namesRemainingAfterCurrentPlayer-2) 

        He picks another player from those already played 
            OddsFail(playersRemaining-1, namesRemainingAfterCurrentPlayer-1)

    Current player is NOT one of those whose name is remaining
        He picks another player whose name was remaining 
            OddsFail(playersRemaining-1, namesRemainingAfterCurrentPlayer-1) 

        He picks another player from those already played 
            OddsFail(playersRemaining-1, namesRemainingAfterCurrentPlayer-0)

    Odds for these four states can be easily calculated based on the inputs. 
    
    Final exit condition is
        if (playersRemaining == 1) 
            return namesRemainingAfterCurrentPlayer; 

Solution is OddsFail(players, players).
`