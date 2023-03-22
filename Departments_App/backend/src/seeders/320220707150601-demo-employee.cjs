'use strict';

const { Op } = require('sequelize');
const { employeesTable } = require('../migrations/320220707135550-create-employee.cjs');

const employeesAmount = 100;
const date = '2022-7-7';

module.exports = {
    async up(queryInterface, Sequelize) {
        const employees = [];

        for (let i = 1; i <= employeesAmount; i++) {
            employees.push({
                id: i,
                departmentId: 1,
                userId: i,
                firstName: `Yulian${i}`,
                lastName: 'Khomechko',
                email: `yulian${i}@gmail.com`,
                birthDate: '2000-12-21',
                salary: 2000,
                createdAt: date,
                updatedAt: date
            });
        }

        await queryInterface.bulkInsert(employeesTable, employees);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(employeesTable, { id: { [Op.lte]: employeesAmount } }, {});
    }
};
