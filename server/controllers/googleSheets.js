var GoogleSpreadsheet = require('google-spreadsheet');
var config = require('../../config');

var doc = new GoogleSpreadsheet(config.sheetsId);
var sheet;
var creds = require('../../' + config.authFileName);

exports.getSheetInfo = function(member, message){
  doc.useServiceAccountAuth(creds, function(err){
    if (err) throw err;
    doc.getInfo(function(err, info) {
      if(err) throw err;
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      sheet.setHeaderRow(['phone', 'prayer'], function(err){
        if(err) throw err;
      });
    });
  });
};

exports.addPrayer = function(phone, message, cb){
  var date = new Date();
  date = date.toDateString();


  var rowData = {
    phone: phone,
    prayer: message,
    date: date
  };
  doc.useServiceAccountAuth(creds, function(err){
    if (err) return cb(err);
    doc.getInfo(function(err, info) {
      if(err) return cb(err);
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[info.worksheets.length - 1];
      console.log('Loaded: '+sheet.title);
      sheet.setHeaderRow(['phone', 'prayer', 'date'], function(err){
        if(err) throw err;
      });
      sheet.addRow(rowData, function(err){
        if (err){
          console.log(err);
          return cb(err);
        } else {
          console.log('Prayer entered');
          return cb(null);
        }
      })
    });
  });
}
