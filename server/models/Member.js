module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Member.hasMany(models.PrayerItem, {
          foreignKey: 'memberId',
          as: 'prayerItems',
        });
      }
    }
  });
  return Member;
};
