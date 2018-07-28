let chances = 0;

class Bag
{
    constructor(size1, size2, size3, size4, size5)
    {
        this.items = [];
        this.items[1] = size1 || 0;
        this.items[2] = size2 || 0;
        this.items[3] = size3 || 0;
        this.items[4] = size4 || 0;
        this.items[5] = size5 || 0;
    }

    state()
    {
        return this.items[1] + '-' + this.items[2] + '-' + this.items[3] + '-' + this.items[4] + '-' + this.items[5];
    }
    clone()
    {
        let b = new Bag();
        b.items = Array.from(this.items);
        return b;
    }

    count()
    {
        return this.items[1] + this.items[2] + this.items[3] + this.items[4] + this.items[5];
    }

    $process(size)
    {
        if (this.count() === 0)
            return undefined;
        if (this.items[size] < 1)
            return undefined;

        let newBag = this.clone();

        newBag.items[size]--;

        while (size < 5)
        {
            size++;
            newBag.items[size]++;
        }

        return newBag;
    }

    process(odds, count)
    {
        if (this.count() === 0)
            return;

        if (this.count() === 1)
        {
            if (this.items[5] === 1)
            {
                chances += odds * count;
                return;
            }
            else if (this.items[1] === 1)
            {
                // Start ... don't count either
                let b = this.$process(1);
                b.process(1, 0);
                return;
            }
            else
            {
                count++;
            }
        }

        // Short cut
        if (this.count() === this.items[5])
        {
            chances += odds * count;
            return;
        }

        for (let s = 1; s <= 5; s++)
        {            
            let o = this.items[s];
            if (o === 0)
                continue;

            o = o / this.count();
            let b = this.$process(s);
            if (b !== undefined)
                b.process(odds * o, count);
        }
    }
}

function fastVersion()
{
    chances = 0;
    new Bag(1).process(1, 0);
    return chances;
}

function slowVersion()
{
    function cut(size)
    {
        let bag = [];

        if (size < 5)
        {
            return [size+1, ...cut(size+1)];
        }
        else
        {
            return [];
        }
    }

    function evaluate(bag, odds, count)
    {
        if (bag.length === 1)
        {
            let size = bag[0];
            if (size != 5)
            {
                count++;            
                let newBag = cut(bag[0]);
                evaluate(newBag, odds, count);
            }
            else
            {
                chances += count * odds;
                return;
            }
        }
        else
        {
            bag.sort((a, b) => a-b);

            if (bag[0] === 5)
            {
                chances += count * odds;
                return;
            }

            let chance = (1/bag.length) * odds;
            
            for (let i = 0; i < bag.length; i++)
            {
                let newBag = [];
                let size = bag[i];
                if (size != 5)
                {
                    newBag = cut(size);
                }

                for (let j = 0; j < bag.length; j++)
                {
                    if (j != i)
                        newBag.push(bag[j]);
                }
                evaluate(newBag, chance, count);
            }
        }
    }

    chances = 0;
    evaluate(cut(1), 1, 0);
    return chances;
}

let answer;

answer = fastVersion();
console.log('Answer', answer.toFixed(6));

// answer = slowVersion();
// console.log('Answer', answer.toFixed(6));