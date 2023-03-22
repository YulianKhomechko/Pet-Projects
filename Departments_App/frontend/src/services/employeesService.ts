import { api } from './axios';
import { Employee, EmployeeCreate } from '../models/Employee';
import { PaginatedResponse } from '../constants/PaginatedResponse';

export const getEmployees = async (departmentId: number, query: string) => {
    return await api.get<PaginatedResponse<Employee>>(`/departments/${departmentId}/employees/${query}`);
};

export const getEmployee = async (departmentId: number, employeeId: number) => {
    return await api.get<Employee>(`/departments/${departmentId}/employees/${employeeId}`);
};

export const postEmployee = async (departmentId: number, data: EmployeeCreate) => {
    return await api.post<Employee>(`/departments/${departmentId}/employees`, data);
};

export const patchEmployee = async <T>(departmentId: number, employeeId: number, data: T) => {
    return await api.patch<Employee>(`/departments/${departmentId}/employees/${employeeId}`, data);
};

export const deleteEmployee = async (departmentId: number, employeeId: number) => {
    return await api.delete<void>(`/departments/${departmentId}/employees/${employeeId}`);
};
