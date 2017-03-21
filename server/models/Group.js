var mongoose = require('mongoose');
var config = require('../../config');

var GroupSchema = new mongoose.Schema({
  groupMeBotID: {type: Number, required: true},
  googleSheetsID: {type: String, required: true},
  groupName: {type: String, required: true}
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
