var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;
var googleSheets = require('./googleSheets');
var groupMe = require('./groupmeBot');
var swearjar = require('swearjar');

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = (request, response) => {

    // Get the user's phone number
    var phone = request.body.From;

    Member.findOne({
      where: {phoneNumber: phone}
    })
    .then((member) => {
      if(!member) {
        respond("You are now in the Central Baptist Youth Ministry's prayer request program. Say \"pray [prayer here]\" to submit a prayer. Say \"commands\" for commmands.");
        return createMember(member, phone);
      } else {
        processMessage(member);
      }
    })
    .catch((err) => {
      console.log(err);
      return respond("Couldn't sign you up, try again!");
    });

    function createMember(member, phone){
        return Member.create({
          phoneNumber: phone
        });
    }
    // Process any message the user sent to us
    function processMessage(member) {
        // get the text message command sent by the user
        var msg = request.body.Body || '';
        msg = msg.toLowerCase().trim();

        // Conditional logic to do different things based on the command from
        // the user
        switch (msg.split(' ', 1)[0]){
          case "commands":
            respond("Available commands:\n\"about\": Information about the bot.\n\"pray [prayer here]\": Use this to submit a prayer.\n\"ayy\: lmao\n\"urgent [prayer here]\": Submit a prayer that will be looked at immediately.");
            break;
          case "about":
            respond("This bot was created by Jake Gutierrez.");
            break;
          case "pray":
            processPrayer(member, filterPrayer(msg));
            break;
          case "ayy":
            respond("lmao");
            break;
          case "urgent":
            processUrgentPrayer(member, filterPrayer(msg));
            break;
          default:
            respond("Command not found. Type 'commands' for avaiable commands");
        }
    }

    function processPrayer(member, message){
      var prayer = message;

      Member.findOne({
        where: {phoneNumber: phone}
      })
      .then((member) => createPrayerItem(member, message))
      .then((member) => addPrayerToSheets(member, prayer))
      .then((message) => respond(message))
      .catch((error) => {
        console.log(error);
        return respond("Prayer didn\'t really work.");
      });
    }

    function createPrayerItem(member, message){
      return PrayerItem.create({
        content: message,
        memberId: member.id
      });
    }

    function addPrayerToSheets(member, prayer){
      return new Promise((resolve, reject) => {
        googleSheets.addPrayer(phone, prayer, function(err){
          if (err) reject(new Error(err));

          resolve("Prayer received!");
        });
      });
    }

    //For "urgent" prayers
    function processUrgentPrayer(member, message){
      var prayer = message;

      console.log(prayer);
      groupMe.sendGroupme(prayer)
      .then((message) => processPrayer(member, prayer))
      .catch((err) => {
        console.log(err);
        return respond("Something went wrong!");
      });
    }

    // Filter prayers for naughty words, you never know man
    function filterPrayer(message){
      var prayer = message.split(' ');
      var com = prayer.shift();
      prayer = prayer.join(' ');
      prayer = swearjar.censor(prayer);
      return prayer;
    }

    // Set Content-Type response header and render XML (TwiML) response in a
    // Jade template - sends a text message back to user
    function respond(message) {
        response.type('text/xml');
        response.render('twiml', {
            message: message
        });
    }
};

// Handle form submission
exports.sendMessages = function(request, response) {
    // Get message info from form submission
    var message = request.body.message;
    var imageUrl = request.body.imageUrl;

    // Use model function to send messages to all subscribers
    Subscriber.sendMessage(message, imageUrl, function(err) {
        if (err) {
            request.flash('errors', err.message);
        } else {
            request.flash('successes', 'Messages on their way!');
        }

        response.redirect('/');
    });
};
