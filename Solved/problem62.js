let cache = new Map();

for(let value = 5; ; value++)
{
    let cube = value*value*value;

    let key   = cube.toString().split('').sort().join('');
    let entry = cache.get(key);
    if (entry === undefined)    
    {
        entry = {
            value:cube,
            count:1
        };
        cache.set(key, entry);
    }
    else
    {
        entry.count += 1;
        if (entry.count === 5)
        {
            console.log("Smallest cube for which exactly five permutations of its digits are cube is " + entry.value);
            break;
        }
    }
}