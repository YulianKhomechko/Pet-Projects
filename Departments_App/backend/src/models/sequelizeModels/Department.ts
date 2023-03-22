import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';
import { validNameRegExp } from '../../utils/validators/validationRegExp.js';
import genericScopes from './utils/genericScopes.js';
import { MakeOptional } from '../../constants/MakeOptional.js';

export interface DepartmentModel
    extends Model<InferAttributes<DepartmentModel>, InferCreationAttributes<DepartmentModel>> {
    id: CreationOptional<number>;
    name: string;
    description?: string;
    head: string;
}

export type DepartmentCreateModel = MakeOptional<DepartmentModel, 'id'>;

export const department = sequelize.define<DepartmentModel>(
    'department',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            validate: {
                is: validNameRegExp
            }
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        head: {
            type: DataTypes.STRING(40),
            allowNull: false,
            validate: {
                is: validNameRegExp
            }
        }
    },
    {
        scopes: {
            ...genericScopes
        }
    }
);
