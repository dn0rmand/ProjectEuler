const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const PM = 524287;
const MODULO = 1000000;

const MAX_PM_FRIENDS = (MODULO / 100) * 99;

const $S = [];

function S(k)
{
    if ($S[k])
        return $S[k];

    if (k < 56)
    {
        const s = (100003 - 200003 * k + 300007 * k * k * k) % MODULO;

        $S[k] = s;

        return s;
    }
    else
    {
        const s = (S(k-24) + S(k-55)) % MODULO;

        $S[k] = s;

        return s;
    }
}

const $friends = new Int32Array(MODULO).fill(-1);

function findSet(id)
{
    const toUpdate = [];

    let s = $friends[id];

    while(s >= 0)
    {
        toUpdate.push(id);
        id = s;
        s = $friends[id];
    }

    for(let i of toUpdate)
        $friends[i] = id;

    return id;
}

const tracer = new Tracer(100, true);

function addFriend(c, f)
{
    let c1 = findSet(c);
    let c2 = findSet(f);

    if (c1 !== c2)
    {
        if (c2 === PM)
        {
            $friends[c2] += $friends[c1];
            $friends[c1] = c2;

            tracer.print(_ => -$friends[PM]);
        }
        else if (c1 == PM)
        {
            $friends[c1] += $friends[c2]; 
            $friends[c2] = c1;

            tracer.print(_ => -$friends[PM]);
        }
        else
        {
            $friends[c1] += $friends[c2]; 
            $friends[c2] = c1;
        }
    }
}

function loop()
{
    let calls = 0;

    for(let n = 1; ; n++)
    {
        const caller = S(n+n-1);
        const callee = S(n+n);
        
        if (caller != callee)
        {
            calls++;

            addFriend(caller, callee);

            if ($friends[PM] <= -MAX_PM_FRIENDS)
            {
                tracer.clear();
                return calls;
            }
        }
    }
}

const answer = timeLogger.wrap('', _ => loop());

console.log(`Answer is ${answer}`);