import { CreateModel } from '../constants/CreateModel';

export interface Employee {
    id: number;
    userId: number;
    departmentId: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    salary: number;
}

export type EmployeeCreate = Omit<CreateModel<Employee>, 'userId'>;
