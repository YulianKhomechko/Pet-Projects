import { api } from './axios';
import { Department, DepartmentCreate } from '../models/Department';
import { PaginatedResponse } from '../constants/PaginatedResponse';

export const getDepartments = async (query: string) => {
    return await api.get<PaginatedResponse<Department>>(`/departments/${query}`);
};

export const getDepartment = async (departmentId: number) => {
    return await api.get<Department>(`/departments/${departmentId}`);
};

export const postDepartment = async (data: DepartmentCreate) => {
    return await api.post<Department>('/departments', data);
};

export const patchDepartment = async (departmentId: number, data: Partial<Department>) => {
    return await api.patch<Department>(`/departments/${departmentId}`, data);
};

export const deleteDepartment = async (departmentId: number) => {
    return await api.delete<void>(`/departments/${departmentId}`);
};
