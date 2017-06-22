module.exports = (sequelize, DataTypes) => {
  var PrayerItem = sequelize.define('PrayerItem', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complete: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    prayedForNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: (models) => {
        PrayerItem.belongsTo(models.Member, {
          foreignKey: 'memberId',
          onDelete: 'CASCADE'
        });
        PrayerItem.belongsToMany(models.Member, {
          through: 'PrayedFor',
          as: 'PrayedForItem'
        });
      },
      completePrayersAndSendMessage: () => {
        var Member = sequelize.models.member;

        return PrayerItem.update({complete: true}, { where: {complete: false}})
      }
    },
    instanceMethods:{
      getPrayerContent: function(){
        return this.content;
      }
    }
  });

  //sequelize.sync({force: true});
  return PrayerItem;
};
