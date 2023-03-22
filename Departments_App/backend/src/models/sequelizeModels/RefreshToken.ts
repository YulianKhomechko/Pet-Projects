import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';
import { user } from './User.js';

export interface RefreshTokenModel
    extends Model<InferAttributes<RefreshTokenModel>, InferCreationAttributes<RefreshTokenModel>> {
    id: CreationOptional<number>;
    userId: number;
    token: string;
}

export type RefreshTokenCreateModel = Pick<RefreshTokenModel, 'userId' | 'token'>;

export const refreshTokenModel = sequelize.define<RefreshTokenModel>('refresh_token', {
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
            model: user,
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

user.hasOne(refreshTokenModel, { onDelete: 'CASCADE' });
refreshTokenModel.belongsTo(user);
