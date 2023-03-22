'use strict';

const { DataTypes } = require('sequelize');
const { usersTable } = require('./220220714114133-create-user.cjs');

const refreshTokensTable = 'refresh_tokens';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(refreshTokensTable, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: usersTable,
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(refreshTokensTable);
    },

    refreshTokensTable
};
