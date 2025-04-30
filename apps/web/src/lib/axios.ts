import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response.data.data,
    (error: unknown) => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 500) {
                throw new Error("Internal Server Error");
            }
            throw new Error(error.response?.data.message);
        }
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An unknown error occurred");
    },
);
