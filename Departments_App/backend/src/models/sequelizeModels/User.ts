import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';
import { validNameRegExp } from '../../utils/validators/validationRegExp.js';
import genericScopes from './utils/genericScopes.js';
import { userRoles } from '../../constants/userRoles.js';
import { ChatModel } from './Chat.js';

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id: CreationOptional<number>;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: userRoles;
    getChats?: (params: { [key: string]: any }) => Promise<ChatModel[]>;
}

export type RegisterUserModel = Pick<UserModel, 'firstName' | 'lastName' | 'email' | 'password'>;

const user = sequelize.define<UserModel>(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: userRoles.user,
            validate: {
                isIn: [[userRoles.admin, userRoles.head, userRoles.user]]
            }
        }
    },
    {
        scopes: {
            ...genericScopes
        }
    }
);

export { user };
