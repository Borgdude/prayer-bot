var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;

var findMemberAndSendMessage = (values) => {
    return Member
      .findById(values.memberId)
      .then((member) => {
        return member.sendMessage(member.phoneNumber, values.content);
      })
      .catch((err) => res.status(400).send(err));
 }

exports.updateAllPrayers = (req, res) => {
  PrayerItem
    .update({complete: true}, { where: {complete: false}, returning: true})
    .then((result) => {
      console.log(result);
      res.status(200).send(result)
    })
    .catch((err) => res.status(400).send(err));
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
    .update({complete: true}, {where: { id: req.params.prayerid }, returning: true})
    .spread((affectedCount, affectedRows) => {
      return findMemberAndSendMessage(affectedRows[0].dataValues);
    })
    .then(()=>{
      res.status(200).send({"Success": true});
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