module.exports = (sequelize, DataTypes) => {
  var PrayerItem = sequelize.define('PrayerItem', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    prayedForNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    updateContent: {
      type: DataTypes.STRING,
      allowNull: true
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
