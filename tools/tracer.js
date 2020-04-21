const { gotoSOL, eraseLine, back } = require('console-control-strings');

class Tracer
{
    constructor(speed, enabled, prefix)
    {
        this.enabled    = enabled;
        this.speed      = speed;
        this.prefix     = prefix;
        this.traceCount = 0;
        this.lastLength = 0;
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
                process.stdout.write(str);
                this.lastLength = str.length;
            }

            if (++this.traceCount >= this.speed)
                this.traceCount = 0;
        }
    }
}

module.exports = Tracer;