class State
{
    constructor(previous)
    {
        this.$key = undefined;
        this.count = previous ? previous.count : 1;
    }

    merge(other) 
    {
        this.count += other.count;
        return this;
    }

    clone() 
    {
        return new State(this);
    }

    generateKey() 
    { 
        throw "Not implemented"; 
    }

    get key() 
    { 
        if (this.$key === undefined) {
            this.$key = this.generateKey();
        }
        return this.$key;
    }

    nextStates(callback)
    {
        throw "Not implemented";
    }
}

class StateMachine
{
    constructor(rounds)
    {
        this.rounds     = rounds || -1;
        this.states     = new Map();
        this.newStates  = new Map();
    }

    trace() {

    }

    isValid(state) {
        return true;
    }

    endRound() {

    }

    get result()
    {
        throw "Not implemented";
    }

    get initialState() 
    {
        throw "Not implemented";
    }

    run()
    {
        const start = this.initialState;

        this.states.set(start.key, start);

        while (this.states.size > 0 && this.rounds-- !== 0) {    

            this.trace();

            this.newStates.clear();

            for(const state of this.states.values()) 
            {
                state.nextStates(newState => 
                {
                    if (this.isValid(newState)) {
                        let old = this.newStates.get(newState.key);
                        if (old) {
                            old.merge(newState);
                        } else {
                            this.newStates.set(newState.key, newState);
                        }
                    }
                });
            }

            [this.states, this.newStates] = [this.newStates, this.states];

            this.endRound();
        }

        this.newStates.clear();
        return this; 
    }
}

module.exports = { State, StateMachine };