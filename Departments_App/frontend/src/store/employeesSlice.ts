import { createSlice } from '@reduxjs/toolkit';
import { failedStatus, loadingStatus, operationLoadingStatus, successStatus } from '../constants/statusTypes';
import { createEmployee, fetchEmployees, removeEmployee, updateEmployee } from '../thunks/employeesThunk';
import { isEmployeesFulfilled, isEmployeesPending, isEmployeesRejected } from './helpers/reducerMatcherFunctions';
import type { RootState } from './store';
import { Employee } from '../models/Employee';
import { ResponseError } from '../models/ResponseError';
import { PaginatedResponse } from '../constants/PaginatedResponse';

interface EmployeesState {
    employees: PaginatedResponse<Employee>;
    status: string;
    error: ResponseError | null;
}

const initialState: EmployeesState = {
    employees: {
        rows: [],
        count: 0
    },
    status: '',
    error: null
};

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Employees
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = loadingStatus;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload.data;
            });

        // Create Employee
        builder.addCase(createEmployee.fulfilled, (state, action) => {
            state.employees.rows.push(action.payload);
        });

        // Update Employee
        builder.addCase(updateEmployee.fulfilled, (state, action) => {
            state.employees.rows = state.employees.rows.map((el) => {
                return +el.id === +action.payload.id ? action.payload : el;
            });
        });

        // Remove Employee
        builder.addCase(removeEmployee.fulfilled, (state, action) => {
            state.employees.rows = state.employees.rows.filter((el) => +el.id !== +action.payload);
        });

        builder
            .addMatcher(isEmployeesPending, (state) => {
                state.status = operationLoadingStatus;
            })
            .addMatcher(isEmployeesFulfilled, (state) => {
                state.status = successStatus;
            })
            .addMatcher(isEmployeesRejected, (state, action) => {
                state.status = failedStatus;
                state.error = action.payload;
            });
    }
});

export const selectEmployees = (state: RootState) => state.employees;

export default employeesSlice.reducer;
