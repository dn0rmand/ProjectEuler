const assert    = require('assert');
const timeLog   = require('tools/timeLogger');
const FS        = require('fs');

const MAX_LIMITS = 10000;
const TARGET     = 0.5

const limits = (function()
{
    let total  = (Math.PI*Math.PI)/6;

    const limits = [];

    for (let i = 1; i <= MAX_LIMITS; i++)
    {
        limits[i] = total;
        total -= 1/(i*i);
    }

    return limits;
}());

const preCalculation =  (function()
{
    const preCalculation = [];
    for (let i = 1; i <= MAX_LIMITS; i++)
        preCalculation[i] = 1 / (i*i);
    return preCalculation;
})();

const probabilities =  (function()
{
    const probabilities = [];

    let v = 1;
    for (let i = 0; i <= MAX_LIMITS; i++, v /= 2)
        probabilities[i+1] = v;

    return probabilities;
})();

const FAILED = [];
const RESULT = [];

function p(MAX_DEEP, trace)
{
    function addPass(i)
    {
        for (let j = i; j <= MAX_DEEP+1; j++)
            RESULT[j] += probabilities[i];
    }

    function addFailed(i)
    {
        for(let j = i; j <= MAX_DEEP+1; j++)
            FAILED[j] += probabilities[i];
    }

    function inner(value, i)
    {
        if (value > TARGET)
        {
            addPass(i);
        }
        else if (i > MAX_DEEP)
        {
            if ((value + limits[i]) <= TARGET)
                addFailed(MAX_DEEP+1);
        }
        else if ((value + limits[i+1]) > TARGET)
        {
            inner(value + preCalculation[i], i+1);
            inner(value, i+1);
        }
        else if ((value + limits[i]) > TARGET)
        {
            addFailed(i+1);
            inner(value + preCalculation[i], i+1);
        }
        else
        {
            addFailed(i);
        }
    }

    for (let i = 0; i <= MAX_DEEP+1; i++)
    {
        RESULT[i] = 0;
        FAILED[i] = 0;
    }

    inner(0, 1);

    if (trace)
    {
        console.log('DEEPNESS:', MAX_DEEP);
        console.log('VALID: ',   RESULT[MAX_DEEP]);
        console.log('FAILED:',   FAILED[MAX_DEEP]);
    }

    return RESULT[MAX_DEEP+1].toFixed(8);
}

function makeChar(MAX)
{
    const path1 = [];
    const path2 = [];
    const path3 = [];
    const labels= [];
    
    const SCALE = 100;

    p(MAX);

    for (let i = 20; i <= MAX+1; i++)
    {
        labels.push(i);
        path1.push(SCALE * RESULT[i]);
        path2.push(SCALE * (1-FAILED[i]));
        path3.push((SCALE * RESULT[i]) / (RESULT[i] + FAILED[i]));
    }
    
    const html = `
    <html>
        <head>
            <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
        </head>
        <body>
            <canvas id="myChart" width="auto" height="auto"></canvas>
    
            <script>
                var ctx = document.getElementById('myChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [${labels.join(', ')}],
                        datasets: [{
                            label: 'Pass',
                            fill: false,
                            borderColor: "rgb(255, 99, 132)",
                            data: [ ${ path1.join(', ')} ]
                        },
                        {
                            label: '1-Fail',
                            fill: false,
                            borderColor: "rgb(54, 162, 235)",
                            data: [ ${ path2.join(', ')} ]
                        },
                        {
                            label: 'Pass/(Pass+Fail)',
                            fill: false,
                            borderColor: "rgb(54, 235, 162)",
                            data: [ ${ path3.join(', ')} ]
                        }
                    ]
                    },
                });
            </script>
        </body>
    </html>
    `;
    
    FS.writeFileSync("chart.html", html);
    
    console.log('\rChart generated');
}

let answer = timeLog.wrap('', () => p(35, true));
console.log("Answer is", answer);
