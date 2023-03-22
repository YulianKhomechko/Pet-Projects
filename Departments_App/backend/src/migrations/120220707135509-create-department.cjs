'use strict';

const { DataTypes } = require('sequelize');

const departmentsTable = 'departments';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(departmentsTable, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z\s-]+$/
                }
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            head: {
                type: DataTypes.STRING(40),
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z\s-]+$/
                }
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(departmentsTable);
    },

    departmentsTable
};
