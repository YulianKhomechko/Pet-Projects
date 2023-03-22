import axios from 'axios';

export const baseURL = 'http://localhost:3030';

const api = axios.create({
    baseURL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        return { data: response.data, statusText: response.statusText };
    },
    (error) => {
        return Promise.reject(error.response.data.error);
    }
);

export { api };
