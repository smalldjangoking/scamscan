import axios from "axios"
import store from "../store/store"

const $api = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL || "/v1",
})

const $api_no_auth = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/v1",
})

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await $api.post("/auth/refresh");

                if (res.data?.access_token) {
                    localStorage.setItem("access_token", res.data.access_token);

                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${res.data.access_token}`,
                    };

                    return $api(originalRequest);
                }
            } catch (refreshError) {
                if (refreshError.response?.status !== 500) {
                    store.removeAccessToken()
                    store.addError('Your session has expired. Please sign in again')
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default $api
export { $api_no_auth };