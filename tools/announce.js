module.exports = function(problem, text) 
{
    const SlackWebhook = require('slack-webhook')
    const slack        = new SlackWebhook('https://hooks.slack.com/services/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')
    
    console.log('Problem ' + problem + ': ' + text);
    slack.send({
        username: 'Problem ' + problem,
        text: text,
        icon_emoji: ':loudspeaker:'
      });            
}

