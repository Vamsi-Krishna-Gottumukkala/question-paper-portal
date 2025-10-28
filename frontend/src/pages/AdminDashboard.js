// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import UploadForm from '../components/admin/UploadForm';
import { getFilters } from '../services/api';

function AdminDashboard() {
    const [filters, setFilters] = useState({ branches: [], subjects: [] });
    const [loading, setLoading] = useState(true);

    // Fetch filters on page load (UploadForm needs subjects)
    useEffect(() => {
        const fetchFilters = async () => {
            setLoading(true);
            try {
                const res = await getFilters();
                setFilters(res.data);
            } catch (err) {
                console.error("Failed to load filters", err);
            }
            setLoading(false);
        };
        fetchFilters();
    }, []);

    if (loading) {
        return <div className="card">Loading filters...</div>
    }

    return (
        <div>
            <UploadForm filters={filters} />
            {/* You could add a <ManagePapers /> component here later */}
        </div>
    );
}

export default AdminDashboard;