class BigSet
{
    static maxSize = (2**24 - 100);

    constructor(name)
    {
        this.name = name || '<generic>';
        this.maps = [];
        this.map  = new Set();
    }

    get size()
    {
        return this.maps.reduce((a, m) => a + m.size, this.map.size);
    }

    has(key)
    {
        if (this.map.has(key))
            return true;

        for (let m of this.maps)
        {
            if (m.has(key))
                return true;
        }

        return false;
    }

    add(key)
    {
        this.map.add(key);
        if (this.map.size >= BigSet.maxSize)
        {
            console.log(`... extending map for ${this.name}`);
            this.maps.push(this.map);
            this.map = new Map();
        }
    }

    clear()
    {
        for(let m of this.maps)
            m.clear();

        this.maps = [];
        this.map.clear();
    }
    
    *keys(autoClear)
    {
        yield *this.values(autoClear);
    }

    *values(autoClear)
    {
        for (let m of this.maps)
        {
            yield *m.values();
            if (autoClear)
                m.clear();
        }

        if (autoClear && this.maps.length > 0)
            this.maps = [];

        yield *(this.map.values());

        if (autoClear)
            this.map.clear();
    }     
}

module.exports = BigSet;