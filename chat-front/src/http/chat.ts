import axios from 'axios';
import { IUser } from '../models/user/user.interface';

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
            localStorage.setItem('token', response.data.accessToken);
            return $chat_api.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $chat_api;