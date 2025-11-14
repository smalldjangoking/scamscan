import axios from "axios"

const $api = axios.create({
    withCredentials: true,
    baseURL: '/api'
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
    async (error)  => {
    const originalRequest = error.config
    const status = error.response?.status

    if (error.response?.status === 401 && !error.config._retry) {
        originalRequest._retry = true
        
        const res = await $api.post('/auth/refresh');
        if (res.data.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
        }
        return $api(originalRequest)
    }
    }
)


export default $api