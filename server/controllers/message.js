var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;
var googleSheets = require('./googleSheets');
var groupMe = require('./groupmeBot');
var swearjar = require('swearjar');

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {

    // Get the user's phone number
    var phone = request.body.From;

    Member.findOne({
      where: {phoneNumber: phone}
    })
    .then((member) => {
      if(!member){
        Member.create({
          phoneNumber: phone
        })
        .then((member) => {
          return respond("You are now in the Central Baptist Youth Ministry's prayer request program. Say 'pray [prayer here]' to submit a prayer. Say 'commands' for commmands.");
        })
        .catch((error) => {
          console.log(error);
          return respond('We couldn\'t sign you up - try again.');
        });
      } else {
        processMessage(member);
      }
    })
    .catch((err) => {
      console.log(err);
    });

    // Process any message the user sent to us
    function processMessage(member) {
        // get the text message command sent by the user
        var msg = request.body.Body || '';
        msg = msg.toLowerCase().trim();

        // Conditional logic to do different things based on the command from
        // the user
        switch (msg.split(' ', 1)[0]){
          case "commands":
            respond("Available commands:\n'about':Information about the bot.\n'pray [prayer here]':Use this to submit a prayer.\n'ayy':lmao\n'urgent [prayer here]': Submit a prayer that will be looked at immediately.");
            break;
          case "about":
            respond("This bot was created by Jake Gutierrez.");
            break;
          case "pray":
            processPrayer(member, filterPrayer(msg), false);
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

    function processPrayer(member, message, urgent){
      var prayer = message;
      console.log(prayer);

      Member.findOne({
        where: {phoneNumber: phone}
      })
      .then((member) => {
        PrayerItem.create({
          content: message,
          memberId: member.id
        })
        .then((prayerItem) => {
          googleSheets.addPrayer(member, prayer, function(err){
            if (err) {
              return respond("Something went wrong!");
            } else {
              return respond("Prayer received!");
            }
          });
        })
        .catch((error) => {
          console.log(error);
          return respond("Prayer didnt really work");
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }

    //For "urgent" prayers
    function processUrgentPrayer(member, message){
      var prayer = message;

      console.log(prayer);
      groupMe.sendGroupme(prayer, function(err){
        if (err){
          return respond("Something went wrong");
        } else {
          processPrayer(member, message, true);
        }
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
