var mongoose = require('mongoose');
var twilio = require('twilio');
var config = require('../config');

var client = twilio(config.accountSid, config.authToken);

var prayerSchema = new mongoose.Schema({
  content: String,
  dateCreated: {type: Date, default: Date.now},
  prayedFor: {type: Boolean, default: false}
});

var MembersSchema = new mongoose.Schema({
  phone: String,
  prayers: [prayerSchema]
});

var Member = mongoose.model('Member', MembersSchema);
module.exports = Member;
