import { createAsyncThunk } from '@reduxjs/toolkit';
import { modalCreateSuccess, modalDeleteSuccess, modalEditSuccess } from '../constants/modalTypes';
import {
    deleteDepartment,
    getDepartment,
    getDepartments,
    patchDepartment,
    postDepartment
} from '../services/departmentsService';
import { showModal } from '../store/modalSlice';
import { Department, DepartmentCreate } from '../models/Department';

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async (query: string) => {
    return await getDepartments(query);
});

export const fetchDepartment = createAsyncThunk('departments/fetchDepartment', async (departmentId: number) => {
    return await getDepartment(departmentId);
});

export const createDepartment = createAsyncThunk(
    'departments/createDepartment',
    async (data: DepartmentCreate, { dispatch }) => {
        const { data: responseData, statusText } = await postDepartment(data);
        dispatch(showModal({ type: modalCreateSuccess, text: statusText }));

        return responseData;
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/updateDepartment',
    async ({ departmentId, data }: { departmentId: number; data: Partial<Department> }, { dispatch }) => {
        const { data: responseData, statusText } = await patchDepartment(departmentId, data);
        dispatch(showModal({ type: modalEditSuccess, text: statusText }));

        return { departmentId, data: responseData };
    }
);

export const removeDepartment = createAsyncThunk(
    'departments/deleteDepartment',
    async (departmentId: number, { dispatch }) => {
        const { statusText } = await deleteDepartment(departmentId);
        dispatch(showModal({ type: modalDeleteSuccess, text: statusText }));

        return departmentId;
    }
);
