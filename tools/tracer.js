const { gotoSOL, eraseLine, back } = require('console-control-strings');
const prettyHrtime = require('atlas-pretty-hrtime');

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

    print(callback)
    {
        if (this.enabled)
        {
            if (this.traceCount === 0)
            {
                this.clear(true);
                let str = ` ${callback()} `;
                if (this.remaining !== undefined)
                {                    
                    if (this.start !==  undefined) 
                    {
                        const end = process.hrtime.bigint() - this.start;
                        const estimate = (BigInt(this.remaining) * end) / BigInt(this.speed);
                        str = str + ` - estimated time ${ prettyHrtime(Number(estimate), 2) }`
                    }
                    this.start = process.hrtime.bigint();
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