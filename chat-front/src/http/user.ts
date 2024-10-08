import axios from 'axios';
import { IUser } from '../models/user/user.interface';
import { setupStore } from '../store/store';
import { login, logout } from '../store/reducers/authSlice';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export const AUTH_URL = `http://localhost:5000/api/auth`
export const USER_URL = `http://localhost:5000/api/user`
const store = setupStore()
const $user_api = axios.create({
    withCredentials: true,
    baseURL: USER_URL
})

$user_api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$user_api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${AUTH_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userId', response.data.user.userId)
            localStorage.setItem('auth','true')
            store.dispatch(login(response.data.user.userId)); // Устанавливаем состояние аутентификации
            return $user_api.request(originalRequest);
        } catch (e) {
            store.dispatch(logout());
            localStorage.setItem('userId', '')
            localStorage.setItem('auth','false')
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $user_api;