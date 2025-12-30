import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach token to request headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    deleteAccount: (password) => api.delete('/auth/account', { data: { password } })
};

// Course API calls
export const courseAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getById: (id) => api.get(`/courses/${id}`),
    getByLecturer: (lecturerId) => api.get(`/courses/lecturer/${lecturerId}`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`)
};

// Room API calls
export const roomAPI = {
    getAll: (params) => api.get('/rooms', { params }),
    getById: (id) => api.get(`/rooms/${id}`),
    getByBuilding: (building) => api.get(`/rooms/building/${building}`),
    getAvailable: (params) => api.get('/rooms/available', { params }),
    create: (data) => api.post('/rooms', data),
    update: (id, data) => api.put(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`)
};

// Timetable API calls
export const timetableAPI = {
    getAll: (params) => api.get('/timetables', { params }),
    getById: (id) => api.get(`/timetables/${id}`),
    getEntries: (id) => api.get(`/timetables/${id}/entries`),
    create: (data) => api.post('/timetables', data),
    update: (id, data) => api.put(`/timetables/${id}`, data),
    delete: (id) => api.delete(`/timetables/${id}`),
    publish: (id) => api.post(`/timetables/${id}/publish`),
    unpublish: (id) => api.post(`/timetables/${id}/unpublish`),
    archive: (id) => api.post(`/timetables/${id}/archive`),
    updateMetadata: (id) => api.post(`/timetables/${id}/update-metadata`)
};

// Timetable Entry API calls
export const entryAPI = {
    getAll: (params) => api.get('/entries', { params }),
    getById: (id) => api.get(`/entries/${id}`),
    getByDay: (timetableId, dayOfWeek) => api.get(`/entries/timetable/${timetableId}/day`, { params: { dayOfWeek } }),
    create: (data) => api.post('/entries', data),
    update: (id, data) => api.put(`/entries/${id}`, data),
    delete: (id) => api.delete(`/entries/${id}`),
    checkConflicts: (data) => api.post('/entries/check-conflicts', data)
};

// Conflict API calls
export const conflictAPI = {
    getReport: (timetableId, data) => api.post(`/conflicts/${timetableId}/report`, data),
    validate: (timetableId, data) => api.post(`/conflicts/${timetableId}/validate`, data),
    getLecturerWorkload: (lecturerId, params) => api.get(`/conflicts/lecturers/${lecturerId}/workload`, { params }),
    getSuggestions: (timetableId, data) => api.post(`/conflicts/${timetableId}/suggestions`, data)
};

export default api;