const Member = require('../models').Member;
const PrayerItem = require('../models').PrayerItem;

//GET /members
exports.getAllMembers = (req, res) => {
  return Member
    .findAll({
      include: [{
        model: PrayerItem,
        as: "prayerItems"
      }]
    })
    .then(members => res.status(200).send(members))
    .catch(error => res.status(400).send(error));
};

//GET /members/:memberid
exports.getOneMember = (req, res) => {
  return Member
    .findById(req.params.memberid, {
      include: [{
        model: PrayerItem,
        as: "prayerItems"
      }]
    })
    .then(member => {
      if(!member){
        return res.status(404).send({
          "message": "Member not found"
        });
      } else {
        return res.status(200).send(member);
      }
    })
    .catch(error => res.status(400).send(error));
}
