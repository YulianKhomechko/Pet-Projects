'use strict';

const { errorsTable } = require('../migrations/520220707135556-create-error.cjs');

const id = 1;
const date = '2022-7-7';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(errorsTable, [
            {
                id: id,
                statusCode: 500,
                statusMessage: 'Test error',
                createdAt: date,
                updatedAt: date
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(errorsTable, { id: id }, {});
    }
};
