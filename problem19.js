function isLeapYear(year)
{
    if ((year % 4) !== 0) 
        return false;
    if ((year % 100) !== 0) 
        return true;
    if ((year % 400) === 0)
        return true;
    return false;
}

const months_length = [
    31,// January
    28,// February
    31,// March
    30,// April
    31,// May
    30,// June
    31,// July
    31,// August
    30,// September
    31,// October
    30,// November
    31,// December
];

let year = 1900;
let month= 0;
let day  = 1; // 0=Sunday, 1=Monday, ..., 6=Saturday

let sundays = 0;

while (year < 2001)
{
    if (month === 7 && year === 1965) // august 1965 is a sunday
    {
        if (day !== 0)
            throw 'BAD CALCULATION';
    }
    
    if (day === 0 && year > 1900)
        sundays++;

    let length = months_length[month];
    if (length === 28 && isLeapYear(year))
        length = 29;
    
    day   = (day+length) % 7;
    month = (month+1) % 12;
    if (month === 0)
        year++;
}

console.log(sundays + " Sundays");