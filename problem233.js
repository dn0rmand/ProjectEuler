/*

(0,0), (N,0),(0,N), and (N,N)


(x – h)2 + (y – k)2 = r2

(0 - h)2 + (0 - k)2 = r2
(N - h)2 + (0 - k)2 = r2
(0 - h)2 + (N - k)2 = r2
(N - h)2 + (N - k)2 = r2


h2 = (N-h)2 -> N = 2h -> h = N/2
k2 = (N-k)2 -> N = 2k -> k = N/2

2*center = N;
N^2/2 = r2
2*center*center = r2

(x – h)2 + (y – k)2 = r2

(y – center)^2 + (x – center)^2 = 2*center^2
y^2 - 2*center*y + center^2 + x^2 - 2*center*x + center^2 = 2*center^2
y^2 - 2*center*y + x*(x - 2*center) = 0

A = 1
B = -2*center
C = x*(x-2*center)

delta^2 = B^2-4AC

y = -center + Math.sqrt((center-x)*(center+x))

---------------------------------------------

X = x-center
Y = y-center

X^2+Y^2=R^2

k = N/2

(X-1/2)^2 + Y^2 = 1/4 * 5^(k-1)


-----------------------

N(r) = R2(r^2) R2(n) is the number of representations of n by summing 2 squares
*/

const bigNum = require('bigNumber.js');
const sqrt2  = Math.sqrt(2);

function R2(r)
{
    
}

function f(n)
{
    let r2 = N*N*2;
    let N  = R2(r2);

    return N*8 - 4;
}

function round(v)
{
    if (v < 0)
        return Math.ceil(v)
    else   
        return Math.floor(v);
}

function fx(N)
{
    let r2 = N*N*2;
    let center = N/2;
    let radius = N * sqrt2;

    function intersect(x)
    {
        let delta = N*N + 4*N*x - 4*x*x ;
        
        delta = Math.sqrt(delta);
        let result = (Math.floor(delta) === delta);
        return result;
    }

    // intersect(0);
    // intersect(N);

    let count= 0;

    for(let x = round(center); x <= N; x++)
    {
        if (intersect(x))
        {
            count++;
        }
    }

    return count*8 - 4;
}

console.log(f(1328125));
console.log(f(84246500));

let max = -1;
let sum = 0;
for (let N = 0; N <= 38000000/*100000000000*/; N ++)
{
    let r =  f(N);
    if (r === 420)
    {
        sum += N;
    }
    // if (r > max)
    // {
    //     console.log(N + ' -> ' + r);
    //     max = r;
    // }
}
console.log(sum);
