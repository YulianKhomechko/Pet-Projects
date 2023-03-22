import { ParamsDictionary } from 'express-serve-static-core';

export interface Params extends ParamsDictionary {}

export interface DepartmentParams extends Params {
    departmentId: string;
}

export interface EmployeeParams extends DepartmentParams {
    employeeId: string;
}

export interface ChatParams extends Params {
    chatId: string;
}

export interface UserParams extends Params {
    userId: string;
}
