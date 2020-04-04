const { gotoSOL, eraseLine, back } = require('console-control-strings');

class Tracer
{
    constructor(speed, enabled)
    {
        this.enabled    = enabled;
        this.speed      = speed;
        this.traceCount = 0;
        this.lastLength = 0;
    }

    clear()
    {
        if (this.enabled)
        {
            if (this.lastLength)
            {
                process.stdout.write(back(this.lastLength));
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
                this.clear();
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