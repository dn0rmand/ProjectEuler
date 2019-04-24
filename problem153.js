A(n, S=[])=sigma(n)+sumdiv(n*I, d, if(real(d)&imag(d)&!setsearch(S, d=vecsort(abs([real(d), imag(d)]) )), S=setunion(S, [d]); (d[1]+d[2])<<(d[1]!=d[2])))

sum(X = 1, 100000000, A(X))


sigma(n) => Sum of divisors of n
sumdiv(n, X, expr) => sum of expr(X) for X in divisors or n
real(n) => real part of n
imag(n) => imaginary part of n
I => i
if(a, expr1, expr2) => if a != 0 then expr1 else expr2
setseach(S, x) => x included in S


1, 6, 10, 23, 35, 55, 63, 92, 105, 161

6 = 55

6 = 2*3
A(2) = A(2*5) - 5*A(2) = 161 - 30
