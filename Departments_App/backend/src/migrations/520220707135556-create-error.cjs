'use strict';

const { DataTypes } = require('sequelize');

const errorsTable = 'errors';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(errorsTable, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            statusCode: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isNumeric: true
                }
            },
            statusMessage: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(errorsTable);
    },

    errorsTable
};
