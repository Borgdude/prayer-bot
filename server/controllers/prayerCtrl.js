var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;

exports.updateAllPrayers = (req, res) => {
  PrayerItem
    .update({complete: true}, { where: {complete: false}, returning: true})
    .spread((affectedCount, affectedRows) => sendMessage(affectedRows))
    .then((result) => {
      console.log(result);
      res.status(200).send(result)
    })
    .catch((err) => res.status(400).send(err));

  var sendMessage = (prayerItems) => {
    return new Promise(function(resolve, reject) {
      var result = [];

      if(!prayerItems) {
        reject("No prayer items");
      }
      prayerItems.forEach((item) => {
        console.log(item.id);
        result.push({phone: findMember(item).next(), prayer: item.content})
      });

      console.log(result);
      resolve(result);
    });

  }

  function findMember (item){
    return Member
      .findById(item.memberId)
      .then((member) => {
        return member
      })
      .catch((err) => new Error (err));
  }
}

exports.getOneUnprayedFor = (req, res) => {
  PrayerItem
    .findOne({where: {complete: false}}).then(prayer => {
      if(!prayer){
        res.status(204).send({"message":"All Prayers Completed"});
      } else {
        res.status(200).send(prayer);
      }

    })
    .catch((err) => {
      console.log("Unprayed For Not Found");
      res.status(404).send(err);
    });
}

exports.updateOnePrayer = (req, res) => {
  PrayerItem
    .update({complete: true}, {where: { id: req.params.prayerid }})
    .then((result) => {
      res.status(200).send({"message": "Updated Successfully"});
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

exports.getAllPrayers = (req, res) => {
  return PrayerItem
    .findAll()
    .then(prayers => res.status(200).send(prayers))
    .catch(error => res.status(400).send(error));
}

exports.incrementOnePrayer = (req, res) => {
  return PrayerItem
    .findById(req.params.prayerid)
    .then((prayer) => prayer.increment('prayedForNumber'))
    .then((whatever) => res.status(200).send(whatever))
    .catch((err) => res.status(400).send(err))
}