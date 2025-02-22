import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const consoleApi = {
    getAll: () => api.get('/consoles'),
    getById: (id) => api.get(`/consoles/${id}`),
    rent: (id, data) => api.post(`/rentals`, { consoleId: id, ...data })
};

export const userApi = {
    login: (data) => api.post('/users/login', data),
    register: (data) => api.post('/users/register', data),
    getProfile: () => api.get('/users/profile')
};

export const cartApi = {
    add: (consoleId) => api.post('/cart', { consoleId }),
    get: () => api.get('/cart'),
    remove: (itemId) => api.delete(`/cart/${itemId}`)
}; 