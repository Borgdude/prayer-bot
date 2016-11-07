var Member = require('../models/Member');

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {

    // Get the user's phone number
    var phone = request.body.From;

    Member.findOne({
        phone: phone
    }, function(err, mem) {
        if (err) return respond('Derp! Please text back again later.');

        if (!mem) {
            var newMember = new Member({
                phone: phone
            });

            newMember.save(function(err, newMem) {
                if (err || !newMem)
                    return respond('We couldn\'t sign you up - try again.');

                // We're signed up but not subscribed - prompt to subscribe
                respond("You are now in the Central Baptist Youth Ministry's prayer request program. Say 'pray [prayer here]' to submit a prayer. Say 'commands' for commmands.");
            });
        } else {
            // For an existing user, process any input message they sent and
            // send back an appropriate message
            processMessage(mem);
        }
    });

    // Process any message the user sent to us
    function processMessage(member) {
        // get the text message command sent by the user
        var msg = request.body.Body || '';
        msg = msg.toLowerCase().trim();

        console.log(msg.split(' ', 1));
        // Conditional logic to do different things based on the command from
        // the user
        switch (msg.split(' ', 1)[0]){
          case "commands":
            respond("Available commands:\n'about':Information about the bot.\n'pray [prayer here]':Use this to submit a prayer.");
            break;
          case "about":
            respond("This bot was crated by Jake Gutierrez.");
            break;
          case "pray":
            processPrayer(member, msg);
            break;
          default:
            respond("Command not found. Type 'commands' for avaiable commands");
        }
    }

    function processPrayer(member, message){
      var prayer = message.split(' ');
      var com = prayer.shift();
      prayer = prayer.join(' ');

      console.log(prayer);

      Member.findOne({
        phone: phone
      })
      .select('prayers')
      .exec(function(err, member){
        if (err){
          console.log(err);
        } else {
          member.prayers.push({
            content: prayer
          });
          member.save(function(err, member){
            if(err){
              respond("Prayer didnt really work");
              console.log("Prayer didnt really work");
            } else {
              respond("Prayer received!");
            }
          })
        }

      });
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
