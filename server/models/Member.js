var config = require('../../config');
var twilio = require('twilio');

var client = twilio(config.accountSid, config.authToken);

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Member.hasMany(models.PrayerItem, {
          foreignKey: 'memberId',
          as: 'prayerItems',
        });
      }
    },
    instanceMethods: {
      sendMessage: (phone, prayer) => {
        return new Promise(function(resolve, reject) {
          var options = {
            to: phone,
            from: config.twilioNumber,
            body: "Your prayer: '" + prayer + "' has been prayed for!"
          };

          client.sendMessage(options, function(err, response){
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("Message sent to:" +  phone);
              resolve(response);
            }

          });
        });
      }
    }
  });
  return Member;
};
