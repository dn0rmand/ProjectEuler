class BigMap
{
    static maxSize = (2**24 - 100);

    constructor(name)
    {
        this.name = name || '<generic>';
        this.maps = [];
        this.map  = new Map();
    }

    get size()
    {
        return this.maps.reduce((a, m) => a + m.size, this.map.size);
    }

    get(key)
    {
        let res = this.map.get(key);
        if (res !== undefined)
            return res;
        for (let m of this.maps)
        {
            res = m.get(key);
            if (res !== undefined)
                return res;
        }
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

    set(key, value)
    {
        this.map.set(key, value);
        if (this.map.size >= BigMap.maxSize)
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

    *keys(autoClear)
    {
        for (let m of this.maps)
        {
            yield *m.keys();
            if (autoClear)
                m.clear();
        }

        if (autoClear && this.maps.length > 0)
            this.maps = [];

        yield *(this.map.keys());
        
        if (autoClear)
            this.map.clear();
    }    
}

module.exports = BigMap;