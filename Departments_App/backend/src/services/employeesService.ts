import ServerError from '../models/Errors/ServerError.js';
import { employee } from '../models/sequelizeModels/index.js';
import { employeeNotBelongToDepartment, httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { paginationParams } from '../utils/pagination/paginationParams.js';
import { EmployeeCreateModel, EmployeeModel } from '../models/sequelizeModels/Employee.js';
import { PaginatedResponse } from '../constants/PaginatedResponse.js';
import { EmployeeQuery } from '../constants/Queries.js';

const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return [year, month, day].join('-');
};

export const getEmployeesService = async (
    departmentId: EmployeeModel['departmentId'],
    query: EmployeeQuery
): Promise<PaginatedResponse<EmployeeModel>> => {
    return await employee.scope('find').findAndCountAll({
        ...paginationParams(query),
        where: { departmentId: departmentId }
    });
};

export const getEmployeeService = async (
    employeeId: EmployeeModel['id'],
    departmentId: EmployeeModel['departmentId']
): Promise<EmployeeModel> => {
    const fetchedEmployee = await employee.scope('find').findByPk(employeeId);
    if (!fetchedEmployee) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
    if (fetchedEmployee.departmentId !== departmentId) {
        throw new ServerError(httpStatusCodes.statusClientError, employeeNotBelongToDepartment(employeeId));
    }
    return fetchedEmployee;
};

export const createEmployeeService = async (data: EmployeeCreateModel): Promise<number> => {
    data.birthDate = formatDate(data.birthDate);

    return (await employee.create(data)).id;
};

export const updateEmployeeService = async (employeeId: EmployeeModel['id'], data: EmployeeModel): Promise<void> => {
    data.birthDate = formatDate(data.birthDate);

    const [affectedRows] = await employee.update(data, {
        where: { id: employeeId }
    });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const deleteEmployeeService = async (employeeId: EmployeeModel['id']): Promise<void> => {
    const affectedRows = await employee.destroy({ where: { id: employeeId } });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const checkIfEmployeeBelongToDep = async (
    employeeId: EmployeeModel['id'],
    departmentId: EmployeeModel['departmentId']
): Promise<void> => {
    const fetchedEmployee = await employee.findByPk(employeeId);
    if (!fetchedEmployee) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
    if (fetchedEmployee.departmentId !== +departmentId) {
        throw new ServerError(httpStatusCodes.statusClientError, employeeNotBelongToDepartment(employeeId));
    }
};
