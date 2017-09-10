var Member = require('../models').Member;
var PrayerItem = require('../models').PrayerItem;
var CronJob = require('cron').CronJob;
const Sequelize = require('sequelize');

if(process.env.NODE_APP_INSTANCE === 0){
  exports.updateMembers = new CronJob('0 0 * * 7', function(){
    Member
      .findAll({
        include: [{
          model: PrayerItem,
          as: "prayerItems",
          where:{
            updateContent: null
          },
          limit: 1,
          order: [['updatedAt', 'DESC']]
        }]
      })
      .then((members) => {
        for(m in members){
          members[m].sendUpdateMessage("Your prayer: \"" + members[m].prayerItems[0].content + "\" currently has been prayed for "
            + members[m].prayerItems[0].prayedForNumber + " times.\n\nText \"update " + members[m].prayerItems[0].id + " [update here]\" to give an update about your prayer request");
        }
      })
      .catch((err) => console.log(err));
  }, null, true, 'America/Los_Angeles');
}

