import { Query } from 'express-serve-static-core';

export interface PaginationQuery extends Query {
    page: string;
    limit: string;
}

export const paginationParams = (query: PaginationQuery) => {
    const defaultPage = 1;
    const defaultLimit = 20;
    const { page: queryPage, limit: queryLimit } = query;

    const page = Number(queryPage) || defaultPage;
    const limit = Number(queryLimit) || defaultLimit;

    return { limit, offset: (page - 1) * limit };
};
