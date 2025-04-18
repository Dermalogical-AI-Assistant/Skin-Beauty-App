export type GenericResponseType<T> = {
    data: T[];
    meta: {
        page: number;
        total: number;
        perPage: number;
    };
}