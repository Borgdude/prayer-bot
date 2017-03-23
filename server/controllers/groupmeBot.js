var HTTPS = require("https");
var config = require('../../config');

exports.sendGroupme = function(prayer){
  return new Promise((resolve, reject) => {
    var options, body, botReq;
    var botID = config.groupmeBotID;

    options = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };

    body = {
      "text": prayer,
      "bot_id": botID
    };

    console.log('sending ' + prayer + ' to ' + botID);

    botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
        // return cb(res.statusCode);
      }
    });

    botReq.on('error', function(err) {
      console.log('error posting message ' + JSON.stringify(err));
      reject(err);
    });
    botReq.on('timeout', function(err) {
      console.log('timeout posting message ' + JSON.stringify(err));
      reject(err);
    });
    botReq.end(JSON.stringify(body));
    resolve("Success!");
  });
}
