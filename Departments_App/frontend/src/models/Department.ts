import { CreateModel } from '../constants/CreateModel';

export interface Department {
    id: number;
    name: string;
    description?: string;
    head: string;
}

export type DepartmentCreate = CreateModel<Department>;
