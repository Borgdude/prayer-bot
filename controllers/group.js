var Group = require('../models/Group');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//GET '/groups'
module.exports.getAllGroups = function(req, res){
  console.log("Finding groups");

  Group.find({}, function(err, groups){
    if (err) sendJsonResponse(res, 400, err);

    sendJsonResponse(res, 200, groups);
  })
};

//POST '/groups'
module.exports.createGroup = function(req, res){
  var group = new Group({
    groupMeBotID: req.body.groupMeID,
    googleSheetsID: req.body.googleID,
    groupName: req.body.groupName
  });
  group.save(function(err, group){
    if(err){
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 200, group);
    }
  });
};

//GET '/groups/:groupid'
module.exports.getOneGroup = function(req, res){
  if(req.params.groupid){
    Group.findById(req.params.groupid, function(err, group){
      if (err){
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 200, group);
      }
    });
  } else {
    sendJsonResponse(res, 400, { "message": "No Group ID"});
  }
};

//PUT '/groups/:groupid'
module.exports.updateGroup = function(req, res){
  if(req.params.groupid){
    Group.findByID(req.params.groupid, function(err, group){
      if(err) sendJsonResponse(res, 400, err);

      group.groupMeBotID = req.body.groupMeID;
      group.googleSheetsID = req.body.googleID;
      group.save(function(err, updatedGroup){
        if(err) sendJsonResponse(res, 400, err);

        sendJsonResponse(res, 200, updatedGroup);
      });
    })
  } else {
    sendJsonResponse(res, 400, { "message": "No Group ID"});
   }
};

//DELTE '/groups/:groupid'
module.exports.deleteOneGroup = function(req, res){
  if(req.params.groupid){
    Group.findByIdAndRemove(req.params.groupid, function(err, group){
      if(err) sendJsonResponse(res, 400, err);

      sendJsonResponse(res, 200, group);
      
    });
  } else {
    sendJsonResponse(res, 400, { "message": "No Group ID"});
   }
}