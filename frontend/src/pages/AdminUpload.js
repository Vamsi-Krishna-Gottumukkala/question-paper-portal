// frontend/src/pages/AdminUpload.js
import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import UploadForm from '../components/admin/UploadForm';
import { getFilters } from '../services/api';

function AdminUpload() {
  const [filters, setFilters] = useState({ branches: [], subjects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const filterRes = await getFilters();
        setFilters(filterRes.data);
      } catch (err) {
        console.error("Failed to load data for admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="admin-upload-page">
      <div className="card">
        <div className="card-header">
          <h2><FaUpload /> Upload New Paper</h2>
          <p>Add a new question paper to the library</p>
        </div>
        {loading ? (
          <p>Loading form resources...</p>
        ) : (
          <UploadForm filters={filters} />
        )}
      </div>
    </div>
  );
}

export default AdminUpload;