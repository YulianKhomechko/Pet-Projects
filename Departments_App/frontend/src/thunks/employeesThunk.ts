import { createAsyncThunk } from '@reduxjs/toolkit';
import { modalCreateSuccess, modalDeleteSuccess, modalEditSuccess } from '../constants/modalTypes';
import { deleteEmployee, getEmployee, getEmployees, patchEmployee, postEmployee } from '../services/employeesService';
import { showModal } from '../store/modalSlice';
import { Employee, EmployeeCreate } from '../models/Employee';

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async ({ departmentId, query }: { departmentId: number; query: string }) => {
        return await getEmployees(departmentId, query);
    }
);

export const fetchEmployee = createAsyncThunk(
    'employees/fetchEmployee',
    async ({ departmentId, employeeId }: { departmentId: number; employeeId: number }) => {
        return await getEmployee(departmentId, employeeId);
    }
);

export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async ({ departmentId, data }: { departmentId: number; data: EmployeeCreate }, { dispatch }) => {
        data.departmentId = departmentId;
        const { data: responseData, statusText } = await postEmployee(departmentId, data);
        dispatch(showModal({ type: modalCreateSuccess, text: statusText }));

        return responseData;
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async (
        { departmentId, employeeId, data }: { departmentId: number; employeeId: number; data: Partial<Employee> },
        { dispatch }
    ) => {
        const { data: responseData, statusText } = await patchEmployee(departmentId, employeeId, data);
        dispatch(showModal({ type: modalEditSuccess, text: statusText }));

        return responseData;
    }
);

export const removeEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async ({ departmentId, employeeId }: { departmentId: number; employeeId: number }, { dispatch }) => {
        const { statusText } = await deleteEmployee(departmentId, employeeId);
        dispatch(showModal({ type: modalDeleteSuccess, text: statusText }));

        return employeeId;
    }
);
