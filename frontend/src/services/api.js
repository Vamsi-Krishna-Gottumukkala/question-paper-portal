// frontend/src/services/api.js
import axios from 'axios';

// Use environment variable for deployed URL, or local proxy for dev
const API_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
    baseURL: API_URL
});

// --- Student Endpoints ---
export const getFilters = () => {
    return api.get('/api/student/filters');
};

export const searchPapers = (searchParams) => {
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

// NEW delete function
export const deletePaper = (paperId, fileKey) => {
    // We send the fileKey in the body so the backend can delete it from S3
    return api.delete(`/api/admin/paper/${paperId}`, {
        data: { fileKey } 
    });
};

export const addBranch = (name) => {
    return api.post('/api/admin/branch', { name });
};

export const updateBranch = (id, name) => {
    return api.put(`/api/admin/branch/${id}`, { name });
};

export const deleteBranch = (id) => {
    return api.delete(`/api/admin/branch/${id}`);
};

export const updatePaperDetails = (paperId, data) => {
  // data = { branch_id, year, semester, subject_name, exam_year }
  return api.put(`/api/admin/paper/${paperId}`, data);
};