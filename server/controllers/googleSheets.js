var GoogleSpreadsheet = require('google-spreadsheet');
var config = require('../../config');

var publicDoc = new GoogleSpreadsheet(config.publicSheetsId);
var privateDoc = new GoogleSpreadsheet(config.privateSheetsId);
var sheet;
var creds = require('../../' + config.authFileName);

exports.getSheetInfo = function(member, message){
  publicDoc.useServiceAccountAuth(creds, function(err){
    if (err) throw err;
    publicDoc.getInfo(function(err, info) {
      if(err) throw err;
      console.log('Loaded publicDoc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      sheet.setHeaderRow(['phone', 'prayer'], function(err){
        if(err) throw err;
      });
    });
  });
};

exports.addPrivatePrayer = function(phone, message, cb){
  var date = new Date();
  date = date.toDateString();

  var rowData = {
    prayer: message,
    date: date
  };
  privateDoc.useServiceAccountAuth(creds, function(err){
    if (err) return cb(err);
      privateDoc.getInfo(function(err, info) {
      if(err) return cb(err);
      console.log('Loaded privateDoc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[info.worksheets.length - 1];
      console.log('Loaded: '+sheet.title);
      sheet.setHeaderRow(['prayer', 'date'], function(err){
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

exports.addPublicPrayer = function(phone, message, cb){
    var date = new Date();
    date = date.toDateString();

    var rowData = {
        prayer: message,
        date: date
    };

    publicDoc.useServiceAccountAuth(creds, function(err){
        if (err) return cb(err);
        publicDoc.getInfo(function(err, info) {
            if(err) return cb(err);
            console.log('Loaded publicDoc: '+info.title+' by '+info.author.email);
            sheet = info.worksheets[info.worksheets.length - 1];
            console.log('Loaded: '+sheet.title);
            sheet.setHeaderRow(['prayer', 'date'], function(err){
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
