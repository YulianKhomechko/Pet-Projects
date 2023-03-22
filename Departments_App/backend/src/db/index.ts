import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('aimprosoft', 'root', 'admin', {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false
});
