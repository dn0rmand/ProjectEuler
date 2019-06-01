function almostSorted(arr)
{
    let start = 0;
    let action = undefined; 
    while (start < arr.length-1)
    {
        if (arr[start] < arr[start+1])
        {
            start++;
            continue;
        }
        if (action !== undefined)
        {
            console.log('no');
            return;
        }

        let end = start;
        for (let j = start+1; j < arr.length; j++)
        {
            if (arr[end] > arr[j])
            {
                end++;
            }
            else
                break;
        }
        if (start >= end)
            throw "Not Possible!!!";

        if (end < arr.length-1 && arr[start] > arr[end+1])
        {
            let y = arr[start+1];
            // Cannot be reverse be could be swap
            while (y <= arr[end] && end < arr.length-1)
            {
                end++;
                if (arr[end] < arr[end-1])
                    break;
            }
            action = `swap ${start+1} ${end+1}`;
            let x = arr[start];
            arr[start] = arr[end];
            arr[end]   = x;
        }
        else if (end-start > 2)
        {
            action = `reverse ${start+1} ${end+1}`;
            let s = start;
            while (start < end)
            {
                let x = arr[start];
                arr[start] = arr[end];
                arr[end]   = x;
                start++;
                end--;
            }
            start = s;
            if (start > 0)
                start--;
        }
        else
        {
            action = `swap ${start+1} ${end+1}`;
            let x = arr[start];
            arr[start] = arr[end];
            arr[end]   = x;
            if (start > 0)
                start--;
        }
    }

    console.log('yes');
    if (action)
        console.log(action);
}

almostSorted([43,65,1,98,99,101]);
almostSorted([1,5,4,3,2,6]);
almostSorted([4,2]);
almostSorted([3,1,2]);