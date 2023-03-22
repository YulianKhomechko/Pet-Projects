import { Response, NextFunction } from 'express';
import {
    createDepartmentService,
    deleteDepartmentService,
    getDepartmentService,
    getDepartmentsService,
    updateDepartmentService
} from '../services/departmentsService.js';
import { httpMessages } from '../utils/http/httpMessages.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { DepartmentQuery } from '../constants/Queries.js';
import { DepartmentParams } from '../constants/Params.js';
import { DepartmentCreateModel, DepartmentModel } from '../models/sequelizeModels/Department.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

export const getDepartments = async (
    req: ExtendedRequest<{}, null, DepartmentQuery>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const departments = await getDepartmentsService(req.query);

        res.status(httpStatusCodes.statusOK).json(departments);
    } catch (error) {
        next(error);
    }
};

export const getDepartment = async (
    req: ExtendedRequest<DepartmentParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId } = req.params;

        const department = await getDepartmentService(+departmentId);

        res.status(httpStatusCodes.statusOK).json(department);
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (
    req: ExtendedRequest<{}, DepartmentCreateModel>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const department = req.body;

        department.id = await createDepartmentService(department);

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(department);
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (
    req: ExtendedRequest<DepartmentParams, Partial<DepartmentModel>>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId } = req.params;

        const department = req.body;

        await updateDepartmentService(+departmentId, department);

        department.id = +departmentId;

        res.statusMessage = httpMessages.statusEntityUpdate;
        res.status(httpStatusCodes.statusOK).json(department);
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (
    req: ExtendedRequest<DepartmentParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { departmentId } = req.params;

        await deleteDepartmentService(+departmentId);

        res.statusMessage = httpMessages.statusEntityDelete;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};
