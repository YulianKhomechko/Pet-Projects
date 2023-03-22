'use strict';

const { DataTypes } = require('sequelize');

const usersTable = 'users';
const validNameRegExp = /^[a-zA-Z\s-]+$/;


module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(usersTable, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING(60),
                allowNull: false
            },
            role: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'user',
                validate: {
                    isIn: ['user', 'head', 'admin']
                }
            },
            firstName: {
                type: DataTypes.STRING(40),
                allowNull: false,
                validate: {
                    is: validNameRegExp
                }
            },
            lastName: {
                type: DataTypes.STRING(40),
                allowNull: false,
                validate: {
                    is: validNameRegExp
                }
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
        // await queryInterface.addColumn(usersTable, 'firstName', {
        //   type: DataTypes.STRING(40),
        //   allowNull: false,
        //   validate: {
        //     is: validNameRegExp
        //   }
        // });
        // await queryInterface.addColumn(usersTable, 'lastName', {
        //   type: DataTypes.STRING(40),
        //   allowNull: false,
        //   validate: {
        //     is: validNameRegExp
        //   }
        // });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(usersTable);
    },

    usersTable
};
