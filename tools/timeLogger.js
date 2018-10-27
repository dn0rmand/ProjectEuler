"use strict"

const prettyHrtime = require('pretty-hrtime');

module.exports = function(title, action, postMessage)
{
    if (title !== undefined)
        console.log(title);
    if (postMessage === undefined)
        postMessage = "Executed in";
    let time = process.hrtime();
    let result = action();
    time = process.hrtime(time);
    console.log(postMessage, prettyHrtime(time, {verbose:true}))
    return result;
}
