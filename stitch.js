const pixels = require("pixels-please");

class Section
{
    constructor(image, x0, y0)
    {
        this.image = image;
        this.x     = x0;
        this.y     = y0;
        this.ups   = [];
        this.downs = [];
        this.rights= [];
        this.lefts = [];

        var left = [];
        var right= [];
        var up   = [];
        var down = [];

        for (let y = y0; y < y0+100; y++)
        {
            left.push(image.getPixel(x0, y));
            right.push(image.getPixel(x0 + 99, y));
        }

        for (let x = x0; x < x0+100; x++)
        {
            up.push(image.getPixel(x, y0));
            down.push(image.getPixel(x, y0+99));
        }

        this.up    = up.join('-');
        this.down  = down.join('-');
        this.left  = left.join('-');
        this.right = right.join('-');

        image.registerSection(this.up, this);
        image.registerSection(this.down, this);
        image.registerSection(this.right, this);
        image.registerSection(this.left, this);

        image.sections.push(this);
    }
}

class Image
{
    constructor(path)
    {
        let image = pixels(path);
        let header = image.toHeaderSync();
        
        this.width = header.width;
        this.height = header.height;
        this.sections = [];
        this.keys = new Map();
    
        if (this.width % 100 !== 0)
            this.width = this.width + (100 - (this.width % 100));
        if (this.height % 100 !== 0)
            this.height = this.height + (100 - (this.height % 100));
        
        if (header.width !== this.width || header.height !== this.height)
        {
            this.bytes = image.bytes({format: 'argb'}).resize(this.width, this.height).toBufferSync();
        }
        else
        {
            this.bytes = image.bytes({format: 'argb'}).toBufferSync();
        }

        let size1 = this.bytes.length;
        let size2 = this.width * this.height * 4;

        console.log(size1, size2);
    }

    getPixel(x, y)
    {
        let index = ((y * this.width) + x) * 4;
        let r = this.bytes[index];
        let g = this.bytes[index+1];
        let b = this.bytes[index+2];
        let a = this.bytes[index+3];
        if (a !== 255)
            throw "Transparency not supported";

        let color = (((r << 8) | g) << 8) | b;
        if (color < 0)
            throw "Error";

        return color;
    }

    registerSection(key, section)
    {
        let v = this.keys.get(key);
        if (v === undefined)
        {
            this.keys.set(key, [section]);
        }
        else if (! v.includes(section))
        {
            v.push(section);
        }
    }

    split()
    {
        for (let y0 = 0; y0 < this.height; y0 += 100)
        for (let x0 = 0; x0 < this.width; x0 += 100)
        {
            new Section(this, x0, y0);
        }
    }    

    findMatch(key, sectionToExclude)
    {
        let result = [];
        let sections;

        sections = this.keys.get(key);
        if (sections !== undefined)
            for (let section of sections)
                if (section != sectionToExclude && ! result.includes(section))
                    result.push(section);
        
        // Reverse the key

        let k2 = key.split('-').reverse().join('-');
        if (k2 !== key)
        {
            sections = this.keys.get(k2);
            if (sections !== undefined)
                for (let section of sections)
                    if (section != sectionToExclude && ! result.includes(section))
                        result.push(section);
        }

        return result;
    }

    matchSections()
    {
        for (let section of this.sections)
        {
            section.ups    = this.findMatch(section.up, section);
            section.downs  = this.findMatch(section.down, section);
            section.lefts  = this.findMatch(section.left, section);
            section.rights = this.findMatch(section.right, section);
        }
    }
}

let image = new Image("./data/monaLisa.jpg");
image.split();
image.matchSections();

console.log('Done');