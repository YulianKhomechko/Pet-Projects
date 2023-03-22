import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';

export interface ErrorModel extends Model<InferAttributes<ErrorModel>, InferCreationAttributes<ErrorModel>> {
    id: CreationOptional<number>;
    statusCode: number;
    statusMessage: string;
}

export const errorModel = sequelize.define<ErrorModel>('error', {
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
    }
});
