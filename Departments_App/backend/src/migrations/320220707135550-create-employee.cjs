'use strict';

const { DataTypes } = require('sequelize');
const { departmentsTable } = require('./120220707135509-create-department.cjs');

const employeesTable = 'employees';

const validNameRegExp = /^[a-zA-Z\s-]+$/;
const minDate = '1/1/1901';
const minSalary = 100;
const maxSalary = 99999;

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(employeesTable, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            departmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: departmentsTable,
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
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
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            birthDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true,
                    isAfter: minDate,
                    isBefore: new Date().toLocaleDateString()
                }
            },
            salary: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: true,
                    min: minSalary,
                    max: maxSalary
                }
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(employeesTable);
    },

    employeesTable
};
