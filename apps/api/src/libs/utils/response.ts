export class ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export class ApiSuccessResponse {
    success: boolean = true;
}

export class ApiResponseWithPagination<T> extends ApiResponse<T> {
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

export class ApiErrorResponse<T> extends ApiResponse<T> {
    success: boolean = false;
}

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
    success: true,
    message,
    data,
});

export const errorResponse = <T>(data: T, message?: string): ApiErrorResponse<T> => ({
    success: false,
    message,
    data,
});
