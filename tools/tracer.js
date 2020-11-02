const { gotoSOL, eraseLine, back } = require('console-control-strings');
const prettyHrtime = require('atlas-pretty-hrtime');
const assert = require('assert');

class Tracer
{
    constructor(speed, enabled, prefix)
    {
        this.enabled    = enabled;
        this.speed      = speed;
        this.prefix     = prefix;
        this.traceCount = 0;
        this.lastLength = 0;
        this.start      = undefined;
        this.remaining  = undefined;
        this.executed   = undefined;
        this.estimated  = undefined;
    }

    get prefix() 
    { 
        return this.$prefix; 
    }

    set prefix(value)
    {
        this.clear(false);
        this.$prefix = value || '';

        if (this.$prefix && this.enabled)
            process.stdout.write(` ${ this.$prefix} `);
    }

    clear(excludePrefix)
    {
        if (this.enabled)
        {
            let length = this.lastLength;
            
            if (!excludePrefix && this.prefix)
                length += this.prefix.length+2;

            if (length)
            {
                process.stdout.write(back(length));
                process.stdout.write(eraseLine());
            }
        }
    }

    setRemaining(remaining)
    {
        assert.notStrictEqual(remaining, undefined);

        remaining = BigInt(remaining);

        if (this.remaining === undefined) {
            this.remaining = remaining;
            this.start     = process.hrtime.bigint();
            this.executed  = 0n;
        }
        else {
            this.executed  += this.remaining - remaining;
            this.remaining  = remaining;
            const spend     = process.hrtime.bigint() - this.start;
            
            this.estimated  = Number((spend * remaining) / this.executed);
        }
    }

    print(callback)
    {
        if (this.enabled)
        {
            if (this.traceCount === 0)
            {
                this.clear(true);
                let str = ` ${callback()} `;
                if (this.estimated !== undefined)
                { 
                    str += ` - estimated time ${ prettyHrtime(this.estimated, 2) }`;
                }
                process.stdout.write(str);
                this.lastLength = str.length;
            }

            if (++this.traceCount >= this.speed)
                this.traceCount = 0;
        }
    }
}

module.exports = Tracer;