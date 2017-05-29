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
      type: DataTypes.STRING,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: (models) => {
        PrayerItem.belongsTo(models.Member, {
          foreignKey: 'memberId',
          onDelete: 'CASCADE'
        });
      },
      completePrayersAndSendMessage: () => {
        var Member = sequelize.models.member;

        return PrayerItem.update({complete: true}, { where: {complete: false}})
      }
    }
  });
  return PrayerItem;
};
