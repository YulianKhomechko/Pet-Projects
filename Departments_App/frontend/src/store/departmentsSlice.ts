import { createSlice } from '@reduxjs/toolkit';
import { failedStatus, loadingStatus, operationLoadingStatus, successStatus } from '../constants/statusTypes';
import { createDepartment, fetchDepartments, removeDepartment, updateDepartment } from '../thunks/departmentsThunk';
import { isDepartmentsFulfilled, isDepartmentsPending, isDepartmentsRejected } from './helpers/reducerMatcherFunctions';
import type { RootState } from './store';
import { Department } from '../models/Department';
import { ResponseError } from '../models/ResponseError';
import { PaginatedResponse } from '../constants/PaginatedResponse';

interface departmentsState {
    departments: PaginatedResponse<Department>;
    status: string;
    error: ResponseError | null;
}

const initialState: departmentsState = {
    departments: {
        rows: [],
        count: 0
    },
    status: '',
    error: null
};

const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Departments
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.status = loadingStatus;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload.data;
            });

        // Create Department
        builder.addCase(createDepartment.fulfilled, (state, action) => {
            state.departments.rows.push(action.payload);
        });

        // Update Department
        builder.addCase(updateDepartment.fulfilled, (state, action) => {
            const { departmentId, data } = action.payload;
            state.departments.rows = state.departments.rows.map((el) => {
                return +el.id === +departmentId ? data : el;
            });
        });

        // Remove Department
        builder.addCase(removeDepartment.fulfilled, (state, action) => {
            state.departments.rows = state.departments.rows.filter((el) => +el.id !== +action.payload);
        });

        builder
            .addMatcher(isDepartmentsPending, (state) => {
                state.status = operationLoadingStatus;
            })
            .addMatcher(isDepartmentsFulfilled, (state) => {
                state.status = successStatus;
            })
            .addMatcher(isDepartmentsRejected, (state, action) => {
                state.status = failedStatus;
                state.error = action.payload;
            });
    }
});

export const selectDepartments = (state: RootState) => state.departments;

export default departmentsSlice.reducer;
