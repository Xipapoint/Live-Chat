import axios from 'axios';
import { IUser } from '../models/user/user.interface';
import { store } from '../store/store';
import { login, logout } from '../store/reducers/authSlice';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export const CHAT_URL = `http://localhost:5001/api/chat`
export const AUTH_URL = `http://localhost:5000/api/auth`

const $chat_api = axios.create({
    withCredentials: true,
    baseURL: CHAT_URL
})

$chat_api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$chat_api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${AUTH_URL}/refresh`, {withCredentials: true})
            console.log('вау');
            
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userId', response.data.user.userId)
            localStorage.setItem('auth','true')
            store.dispatch(login(response.data.user.userId));
            return $chat_api.request(originalRequest);
        } catch (e) {
            store.dispatch(logout());
            localStorage.setItem('userId', '')
            localStorage.setItem('auth','false')
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $chat_api;