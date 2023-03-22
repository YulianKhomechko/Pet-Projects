export interface PaginatedResponse<T> {
    count: number;
    rows: T[];
}
