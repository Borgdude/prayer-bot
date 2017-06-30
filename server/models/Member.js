var config = require('../../config');
var twilio = require('twilio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var client = twilio(config.accountSid, config.authToken);

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: 'false'
    }
  }, {
    classMethods: {
      associate: (models) => {
        Member.hasMany(models.PrayerItem, {
          foreignKey: 'memberId',
          as: 'prayerItems',
        });
        Member.belongsToMany(models.PrayerItem, {
          through: 'PrayedFor',
          as: 'MemberItem'
        });
      }
    },
    instanceMethods: {
      sendMessage: function(prayer) {
        var phone = this.phoneNumber;
        return new Promise(function(resolve, reject) {
          var options = {
            to: phone,
            from: config.twilioNumber,
            body: "Your prayer: '" + prayer + "' has been prayed for!"
          };

          client.messages.create(options, function(err, response){
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("Message sent to:" +  phone);
              resolve(response);
            }
          });
        });
      },
      sendUpdateMessage: function(message) {
        var phone = this.phoneNumber;
        return new Promise(function(resolve, reject) {
          var options = {
            to: phone,
            from: config.twilioNumber,
            body: message
          };

          client.messages.create(options, function(err, response){
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("Message sent to:" +  phone);
              resolve(response);
            }
          });
        });
      },
      comparePasswordsAndGenToken: function(password) {
        var userid = this.id;
        var phonenumber = this.phoneNumber;
        var hashedpass = this.password;
        console.log(this.phoneNumber);
        return new Promise(function(resolve, reject){
          console.log(hashedpass);
          console.log(password);
          bcrypt.compare(password, hashedpass, (err, same) => {
            if (err) reject(err);

            if(!same){
              const error = new Error('Incorrect phone number or password');
              error.name = 'IncorrectCredentialsError';

              reject(error);
            } else {
              
              const payload = {
                sub: userid
              };

              const token = jwt.sign(payload, process.env.SECRET);
              const data = {
                phonenumber: phonenumber
              };

              resolve(token, data);
            }
          });
        });
      }
    }
  });

  //sequelize.sync({force: true});

  return Member;
};
