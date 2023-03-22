import { Response, NextFunction } from 'express';
import ServerError from '../models/Errors/ServerError.js';
import { getDepartmentService } from '../services/departmentsService.js';
import {
    checkIfEmployeeBelongToDep,
    createEmployeeService,
    deleteEmployeeService,
    getEmployeeService,
    getEmployeesService,
    updateEmployeeService
} from '../services/employeesService.js';
import { createUserService } from '../services/usersService.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpMessages } from '../utils/http/httpMessages.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { EmployeeParams } from '../constants/Params.js';
import { EmployeeCreateModel, EmployeeModel } from '../models/sequelizeModels/Employee.js';
import { EmployeeQuery } from '../constants/Queries.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

export const getEmployees = async (
    req: ExtendedRequest<Omit<EmployeeParams, 'employeeId'>, null, EmployeeQuery>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId } = req.params;

        await getDepartmentService(+departmentId);

        const employees = await getEmployeesService(+departmentId, req.query);

        res.status(httpStatusCodes.statusOK).json(employees);
    } catch (error) {
        next(error);
    }
};

export const getEmployee = async (
    req: ExtendedRequest<EmployeeParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId, employeeId } = req.params;

        await getDepartmentService(+departmentId);

        const employee = await getEmployeeService(+employeeId, +departmentId);

        res.status(httpStatusCodes.statusOK).json(employee);
    } catch (error) {
        next(error);
    }
};

export const createEmployee = async (
    req: ExtendedRequest<Omit<EmployeeParams, 'employeeId'>, EmployeeCreateModel>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId } = req.params;

        await getDepartmentService(+departmentId);

        const data = req.body;
        if (+data.departmentId !== +departmentId) {
            throw new ServerError(httpStatusCodes.statusClientError, httpErrors.invalidData);
        }

        const userId = await createUserService({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
        });
        data.id = await createEmployeeService({
            ...data,
            departmentId: +departmentId,
            userId
        });

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(data);
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (
    req: ExtendedRequest<EmployeeParams, EmployeeModel>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId, employeeId } = req.params;

        await getDepartmentService(+departmentId);

        const data = req.body;

        await checkIfEmployeeBelongToDep(+employeeId, +departmentId);

        data.departmentId = +departmentId;
        data.id = +employeeId;
        await updateEmployeeService(+employeeId, data);

        res.statusMessage = httpMessages.statusEntityUpdate;
        res.status(httpStatusCodes.statusOK).json(data);
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (
    req: ExtendedRequest<EmployeeParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId, employeeId } = req.params;

        await getDepartmentService(+departmentId);
        await checkIfEmployeeBelongToDep(+employeeId, +departmentId);

        await deleteEmployeeService(+employeeId);

        res.statusMessage = httpMessages.statusEntityDelete;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};
