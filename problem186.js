const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const BigNumber = require('bignumber.js');

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

class Friend
{
    static pmFriends = 0;
    static $map = [];
    static old = 0;
    static tracer = new Tracer(100, true);

    static trace()
    {
        if (Friend.old !== Friend.pmFriends)
        {
            Friend.old = Friend.pmFriends;
            Friend.tracer.print(_ => Friend.old);
        }
    }
    
    static init(id)
    {
        if (Friend.$map[id])
            return Friend.$map[id];

        const f = new Friend(id);
        Friend.$map[id] = f;
        return f;
    }

    constructor(id)
    {
        this.id = id;
        this.isPMFriend = (id === PM);
        this.friends = new Map();
    }

    get isPMFriend() 
    { 
        return this.$isPMFriend; 
    }

    set isPMFriend(value)
    {
        if (! value)
        {
            this.$isPMFriend = false;
            return;
        }
        else if (!this.$isPMFriend)
        {            
            this.$isPMFriend = true;
            Friend.pmFriends++;
            Friend.trace();
        }
    }

    isFriend(friend)
    {
        return this.friends.has(friend.id);
    }

    add(friend)
    {
        this.friends.set(friend.id, friend);

        if (friend.isPMFriend)
            this.makePMFriend();
    }

    makePMFriend()
    {
        if (this.isPMFriend)
            return;
    
        let states = new Map();
        
        states.set(0, this);
    
        while (states.size > 0)
        {
            let newStates = new Map();

            for(let s of states.values())
            {
                if (newStates.has(s.id))
                    newStates.delete(s.id);

                s.isPMFriend = true;

                for(let f of s.friends.values())
                {
                    if (! f.isPMFriend)
                        newStates.set(f.id, f);
                }
            }
    
            states = newStates;
        }
    }    
}


function addFriend(c, f)
{
    const oc = Friend.init(c);
    const of = Friend.init(f);

    if (of.isFriend(oc))
        return;

    of.add(oc);
    oc.add(of);
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

            if (Friend.pmFriends >= MAX_PM_FRIENDS)
            {
                Friend.tracer.clear();
                return calls;
            }
        }
    }
}

const answer = timeLogger.wrap('', _ => loop());

console.log(`Answer is ${answer}`);