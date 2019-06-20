"use strict"

const prettyHrtime = require('pretty-hrtime');
const debugging    = ! process.stdout.isTTY;

module.exports = function(title, action, postMessage)
{
    function logEnd(message, time)
    {
        if (message === undefined)
            message = "Executed in";

        if (debugging)
        {
            console.log(message, prettyHrtime(time, {verbose:true}));
        }
        else
        {
            process.stdout.write('.. ');
            process.stdout.write(`${message} ${prettyHrtime(time, {verbose:true})}\r\n`);
        }
    }

    function logStart(message)
    {
        if (debugging)
        {
            console.log(message);
        }
        else
        {
            process.stdout.write(message);
            process.stdout.write(' ..');
        }
    }

    logStart(title);

    let time = process.hrtime();
    try
    {
        return action();
    }
    catch(error)
    {
        postMessage = "Failed! " + error.message;
        throw error;
    }
    finally
    {
        time = process.hrtime(time);
        logEnd(postMessage, time);
    }
}
