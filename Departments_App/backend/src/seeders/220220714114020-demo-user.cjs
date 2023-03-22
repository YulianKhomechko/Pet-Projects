'use strict';

const { Op } = require('sequelize');
const { usersTable } = require('../migrations/220220714114133-create-user.cjs');

const date = '2022-7-7';

const amountOfUsers = 100;

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = [];

        for (let i = 1; i <= amountOfUsers; i++) {
            users.push({
                id: i,
                email: `khomechko${i}@mail.com`,
                password: '$2b$10$OWEVGpv0blYbR4eihN/GheFt9k8uAmlLatgwsKVKFz7Y2vPQPGHQy',
                role: 'user',
                firstName: `Yulian${i}`,
                lastName: 'Khomechko',
                createdAt: date,
                updatedAt: date
            });
        }

        users.push(
            {
                id: 101,
                email: 'admin@mail.com',
                password: '$2b$10$OWEVGpv0blYbR4eihN/GheFt9k8uAmlLatgwsKVKFz7Y2vPQPGHQy',
                role: 'admin',
                firstName: 'John',
                lastName: 'Admin',
                createdAt: date,
                updatedAt: date
            },
            {
                id: 102,
                email: 'head@mail.com',
                password: '$2b$10$OWEVGpv0blYbR4eihN/GheFt9k8uAmlLatgwsKVKFz7Y2vPQPGHQy',
                role: 'head',
                firstName: 'Bob',
                lastName: 'Head',
                createdAt: date,
                updatedAt: date
            }
        );

        await queryInterface.bulkInsert(usersTable, users);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(usersTable, { id: { [Op.lte]: 102 } }, {});
    }
};
