'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('PrayerItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            complete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            public: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            prayedForNumber:{
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            memberId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Members',
                    key: 'id',
                    as: 'memberId'
                }
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('PrayerItems');
    }
};

