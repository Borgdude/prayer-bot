var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;
var googleSheets = require('./googleSheets');
var groupMe = require('./groupmeBot');
var swearjar = require('swearjar');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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
          case "list":
            listPrayerItems();
            break;
          case "update":
            updatePrayer(msg);
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

    function listPrayerItems(){
      Member.find({where: {phoneNumber: phone}})
        .then((member) => member.getPrayerItems({limit: 5, order: [['updatedAt', 'DESC']]}))
        .then((prayers) => processPrayersAndSend(prayers))
        .catch((err) => console.log(err));
    }

    function processPrayersAndSend(prayers){
      return new Promise((resolve, reject) => {
        var result = '';
        for(var prayer in prayers){
          result += "ID: " + prayers[prayer].dataValues.id + ". \"" + prayers[prayer].dataValues.content + ".\" Prayed for: " + prayers[prayer].dataValues.prayedForNumber + " times.\n\n";
        }

        respond(result);
      });
    }

    function updatePrayer(message){
      var prayerId = parseInt(message.split(" ")[1]);
      var update = message.split(" ");
      var com = update.splice(0, 2);
      update = update.join(" ");
      update = update.capitalize();
      //console.log(PrayerItem.Instance.prototype);

      Member.find({where: {phoneNumber: phone}})
        .then((member) => {
          if(!member){
            return "No Member!";
          } else {
            console.log(member.id);
            return PrayerItem.findOne({where: {id: prayerId, memberId: member.id}});
          }
        })
        .then((prayer) => {
          if(!prayer){
            return respond("No prayer found!");
          } else {
            return prayer.updateAttributes({ updateContent: update });
          }
        })
        .then(async (prayer) => {
          respond("Prayer: \"" + prayer.content +"\" now has an update of: \"" + update + "\".");
          var pass = {};
          pass.members = await prayer.getPrayedForItem();
          pass.prayer = prayer.content;
          return pass;
        })
        .then((pass) => {
          // console.log(pass);
          var members = pass.members;
          var prayer = pass.prayer;
          for(m in members){
            members[m].sendUpdateMessage("A prayer you prayed for: \"" + prayer + "\" now has update: \"" + update + "\"");
          }
        })
        .catch((err) => console.log(err));
    }

    // Filter prayers for naughty words, you never know man
    function filterPrayer(message){
      var prayer = message.split(' ');
      var com = prayer.shift();
      prayer = prayer.join(' ');
      prayer = swearjar.censor(prayer);
      return prayer.capitalize();
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
    var message = request.body.message; var imageUrl = request.body.imageUrl;

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
