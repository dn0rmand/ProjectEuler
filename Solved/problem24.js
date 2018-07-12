const used = [];

let MAX = 3;

function *permutations(value, count)
{
    if (count >= MAX)
    {
        yield value;
    }
    else
    {
        for (let i = 0; i < MAX; i++)
        {
            if (used[i] !== 1)
            {
                used[i] = 1;
                let newValue = (value * 10)+i;
                yield *permutations(newValue, count+1);
                used[i] = 0;
            }
        }
    }
} 

let iterator = permutations(0, 0);
let expected = [12, 21, 102, 120, 201, 210];

for(let i = iterator.next(), j = 0; !i.done; i = iterator.next(), j++)
{
    if (i.value !== expected[j])
        throw "permutations generator not working right!";
}

MAX = 10;

iterator = permutations(0, 0);

for(let permutation = iterator.next(), index = 1; ! permutation.done; permutation = iterator.next(), index++)
{
    if (index === 1000000) // millionth
    {
        // Not likely but to be thorough
        let prefix = '';
        if (permutation.value < 1000000000)
            prefix = '0';
        //
        console.log("Millionth lexicographic permutation is " + prefix + permutation.value);
    }
}
