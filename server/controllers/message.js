var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;
var googleSheets = require('./googleSheets');
var groupMe = require('./groupmeBot');
var swearjar = require('swearjar');

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = (request, response) => {

  // Get the user's phone number
  var phone = request.body.From;

  Member.findOne({
    where: { phoneNumber: phone }
  })
    .then((member) => {
      if (!member) {
        respond("You are now in the Central Baptist Youth Ministry's prayer request program. Say \"pray [public\\private] [prayer here]\" to submit a prayer. Say \"commands\" for commmands. View the public prayers at http://pray-link.com");
        return createMember(member, phone);
      } else {
        processMessage(member);
      }
    })
    .catch((err) => {
      console.log(err);
      return respond("Couldn't sign you up, try again!");
    });

  function createMember(member, phone) {
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
    switch (msg.split(' ', 1)[0]) {
      case "commands":
        respond("Available commands:\n\
\"about\": Information about the bot.\n\
\"pray [public/private] [prayer here]\": Use this to submit a prayer.\n\
\"ayy\": lmao\n\
\"urgent [prayer here]\": Submit a prayer that will be looked at immediately.\n\
\"list [number]\": View prayers you have submitted.\n\
\"update [prayer number] [content]\": Update a prayer you submitted to update people about your prayer.\n\
\"link\": Get the google sheets and website links.");
        break;
      case "about":
        respond("This bot was created by Jake Gutierrez.");
        break;
      case "link":
        respond("Google Sheets: https://goo.gl/R4z9Lt\nWebsite: http://pray-link.com");
        break;
      case "pray":
        processPrayer(member, filterPrayer(msg), true);
        break;
      case "ayy":
        respond("lmao");
        break;
      case "urgent":
        processUrgentPrayer(member, filterPrayer(msg));
        break;
      case "list":
        listPrayerItems(msg);
        break;
      case "update":
        updatePrayer(msg);
        break;
      default:
        respond("Command not found. Type 'commands' for avaiable commands");
    }
  }

  function processPrayer(member, message, public) {
    var prayer = message;
    var public = true;

    var arg = message.split(' ')[0];

    if (arg.toLowerCase() === "public"){
      public = true;
      prayer = prayer.replace(arg + " ", '');
    } else if (arg.toLowerCase() === "private"){
      public = false;
      prayer = prayer.replace(arg + " ", '');
    }

    Member.findOne({
      where: { phoneNumber: phone }
    })
      .then((member) => createPrayerItem(member, prayer, public))
      .then((member) => addPrayerToSheets(member, prayer.capitalize(), public))
      .then((message) => respond(message))
      .catch((error) => {
        console.log(error);
        return respond("Prayer didn\'t really work.");
      });
  }

  function createPrayerItem(member, message, public) {
      return PrayerItem.create({
          content: message,
          public: public,
          memberId: member.id
      });
  }

  function addPrayerToSheets(member, prayer, public) {
    return new Promise((resolve, reject) => {
      if(public) {
        googleSheets.addPublicPrayer(phone, prayer, function (err) {
          if (err) reject(new Error(err));

          resolve("Prayer received and added publicly!");
        });
      } else {
        googleSheets.addPrivatePrayer(phone, prayer, function (err) {
          if (err) reject(new Error(err));

          resolve("Prayer received and added privately!");
        });
      }
    });
  }

  //For "urgent" prayers, sends prayer to GroupMe Bot
  function processUrgentPrayer(member, message) {
    var prayer = message;

    console.log(prayer);
    groupMe.sendGroupme(prayer)
      .then((message) => processPrayer(member, prayer, true))
      .catch((err) => {
        console.log(err);
        return respond("Something went wrong!");
      });
  }

  // "list": responds with 5 latest prayer items of specific member
  function listPrayerItems(msg) {
    var page = msg.split(' ')[1] || 1;
    console.log(page);

    var offset = (page - 1) * 5;

    Member.find({ where: { phoneNumber: phone } })
      .then((member) => {
        return PrayerItem.findAndCountAll({ where: { memberId: member.id }, limit: 5, order: [['createdAt', 'DESC']], offset: offset })
      })
      .then((prayers) => processPrayersAndSend(prayers, page))
      .catch((err) => console.log(err));
  }

  // Proccess prayers from prayerItem instance and respond()
  function processPrayersAndSend(thingy, page) {
    return new Promise((resolve, reject) => {
      var result = '';
      var prayers = thingy.rows;
      for (var prayer in prayers) {
        result += "ID: " + prayers[prayer].dataValues.id + ". \"" + prayers[prayer].dataValues.content + ".\" Prayed for: " + prayers[prayer].dataValues.prayedForNumber + " times.\n\n";
      }

      result += "\nPage " + page + " of " + Math.ceil(thingy.count / 5) + ".";

      respond(result);
    });
  }

  // "update [prayer ID]"
  function updatePrayer(message) {
    var prayerId = parseInt(message.split(" ")[1]);
    var update = message.split(" ");
    var com = update.splice(0, 2);
    update = update.join(" ");
    update = update.capitalize();
    //console.log(PrayerItem.Instance.prototype);

    Member.find({ where: { phoneNumber: phone } })
      .then((member) => {
        if (!member) {
          return "No Member!";
        } else {
          console.log(member.id);
          return PrayerItem.findOne({ where: { id: prayerId, memberId: member.id } }); //Find PrayerItem first before updating.
        }
      })
      .then((prayer) => {
        if (!prayer) {
          return respond("No prayer found!");
        } else {
          return prayer.updateAttributes({ updateContent: update });//Update prayer
        }
      })
      .then(async (prayer) => {
        respond("Prayer: \"" + prayer.content + "\" now has an update of: \"" + update + "\".");
        var pass = {};
        pass.members = await prayer.getPrayedForItem(); // Get the members who prayed for that prayer.
        pass.prayer = prayer.content;
        return pass;
      })
      .then((pass) => {
        // console.log(pass);
        var members = pass.members;
        var prayer = pass.prayer;
        for (m in members) {
          members[m].sendUpdateMessage("A prayer you prayed for: \"" + prayer + "\" now has update: \"" + update + "\""); // Send Message to members who prayed for that prayer.
        }
      })
      .catch((err) => console.log(err));
  }

  // Filter prayers for naughty words, you never know man
  function filterPrayer(message) {
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
exports.sendMessages = function (request, response) {
  // Get message info from form submission
  var message = request.body.message; var imageUrl = request.body.imageUrl;

  // Use model function to send messages to all subscribers
  Subscriber.sendMessage(message, imageUrl, function (err) {
    if (err) {
      request.flash('errors', err.message);
    } else {
      request.flash('successes', 'Messages on their way!');
    }

    response.redirect('/');
  });
};
