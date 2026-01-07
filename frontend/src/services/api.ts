import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = '/api';

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchTasks = async (params?: any) => {
    const { data } = await api.get('/tasks', { params });
    return data;
};

export const createTask = async (task: any) => {
    const { data } = await api.post('/tasks', task);
    return data;
};

export const updateTask = async (id: string, task: any) => {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data;
};

export const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
};

export const login = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};
