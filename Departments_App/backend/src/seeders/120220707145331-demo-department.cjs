'use strict';

const { Op } = require('sequelize');
const { departmentsTable } = require('../migrations/120220707135509-create-department.cjs');

const departmentsAmount = 100;
const date = '2022-7-7';

module.exports = {
    async up(queryInterface, Sequelize) {
        const departments = [];

        for (let i = 1; i <= departmentsAmount; i++) {
            departments.push({
                id: i,
                name: `Department ${i}`,
                description: 'This department is responsible for developing software.',
                head: 'Yulian Khomechko',
                createdAt: date,
                updatedAt: date
            });
        }

        await queryInterface.bulkInsert(departmentsTable, departments);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(departmentsTable, { id: { [Op.lte]: departmentsAmount } }, {});
    }
};
