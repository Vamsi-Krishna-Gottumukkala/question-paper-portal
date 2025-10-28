// services/api.js
import axios from 'axios';

// Use environment variable for deployed URL, or local proxy for dev
const API_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
    baseURL: API_URL
});

// --- Student Endpoints ---
export const getFilters = () => {
    // Uses proxy, so /api/student/filters -> http://localhost:8080/api/student/filters
    return api.get('/api/student/filters');
};

export const searchPapers = (searchParams) => {
    // Remove empty params from query
    const queryParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== '')
    );
    return api.get('/api/student/papers', { params: queryParams });
};


// --- Admin Endpoints ---
export const uploadPaper = (formData) => {
    return api.post('/api/admin/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};