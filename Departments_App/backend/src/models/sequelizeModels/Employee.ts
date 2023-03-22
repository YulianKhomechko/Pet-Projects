import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';
import { validNameRegExp } from '../../utils/validators/validationRegExp.js';
import { department } from './Department.js';
import genericScopes from './utils/genericScopes.js';
import { MakeOptional } from '../../constants/MakeOptional.js';
import { user } from './User.js';

export const minDate = '1/1/1901';
export const minSalary = 100;
export const maxSalary = 99999;

export interface EmployeeModel extends Model<InferAttributes<EmployeeModel>, InferCreationAttributes<EmployeeModel>> {
    id: CreationOptional<number>;
    departmentId: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    salary: number;
    userId: number;
}

export type EmployeeCreateModel = MakeOptional<EmployeeModel, 'id'>;

export const employee = sequelize.define<EmployeeModel>(
    'employee',
    {
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
                model: department,
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: user,
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
        }
    },
    {
        scopes: {
            ...genericScopes,
            departmentId(departmentId) {
                return { where: { departmentId: departmentId } };
            }
        }
    }
);

department.hasMany(employee, { onDelete: 'CASCADE' });
employee.belongsTo(department, {
    foreignKey: {
        allowNull: false
    }
});

user.hasOne(employee);
employee.belongsTo(user, {
    foreignKey: {
        allowNull: false
    }
});
