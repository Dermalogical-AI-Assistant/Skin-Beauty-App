export type GenericResponseType<T> = {
    data: T[];
    meta: {
        page: number;
        total: number;
        perPage: number;
    };
}

export type UrlParams = {
  [key: string]: string | string[] | null | undefined;
};