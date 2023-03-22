import ServerError from '../models/Errors/ServerError.js';
import { department } from '../models/sequelizeModels/index.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { paginationParams } from '../utils/pagination/paginationParams.js';
import { DepartmentCreateModel, DepartmentModel } from '../models/sequelizeModels/Department.js';
import { PaginatedResponse } from '../constants/PaginatedResponse.js';
import { DepartmentQuery } from '../constants/Queries.js';

export const getDepartmentsService = async (query: DepartmentQuery): Promise<PaginatedResponse<DepartmentModel>> => {
    return await department.scope('find').findAndCountAll({ ...paginationParams(query) });
};

export const getDepartmentService = async (departmentId: number): Promise<DepartmentModel> => {
    const fetchedDepartment = await department.scope('find').findByPk(departmentId);
    if (!fetchedDepartment) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
    return fetchedDepartment;
};

export const createDepartmentService = async (data: DepartmentCreateModel): Promise<number> => {
    return (await department.create(data)).id;
};

export const updateDepartmentService = async (
    departmentId: DepartmentModel['id'],
    data: Partial<DepartmentModel>
): Promise<void> => {
    const [affectedRows] = await department.update(data, {
        where: { id: departmentId }
    });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const deleteDepartmentService = async (departmentId: DepartmentModel['id']): Promise<void> => {
    const affectedRows = await department.scope({ method: ['id', departmentId] }).destroy();
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};
