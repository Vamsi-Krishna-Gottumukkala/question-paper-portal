// frontend/src/components/admin/EditPaperModal.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { updatePaperDetails } from '../../services/api';
import './EditPaperModal.css'; // We will create this file

function EditPaperModal({ paper, allFilters, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    branch_id: '',
    year: '',
    semester: '',
    subject_name: '',
    exam_year: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  // When the 'paper' prop changes, pre-fill the form
  useEffect(() => {
    if (paper) {
      setFormData({
        branch_id: paper.branch_id || '',
        year: paper.year || '',
        semester: paper.semester || '',
        subject_name: paper.subject_name || '',
        exam_year: paper.exam_year || ''
      });
    }
  }, [paper]);

  if (!paper) {
    return null; // Don't render anything if no paper is selected
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePaperDetails(paper.paper_id, formData);
      setMessage(res.data.message);
      setIsError(false);
      // Wait a moment, then close the modal and refresh the table
      setTimeout(() => {
        onUpdateSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update.');
      setIsError(true);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>Edit Paper Details</h2>
          <button onClick={onClose} className="modal-close-button">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Branch</label>
              <select name="branch_id" value={formData.branch_id} onChange={handleChange} required>
                <option value="">Select branch</option>
                {allFilters.branches.map(b => (
                  <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">Select semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                name="subject_name"
                placeholder="e.g., Data Structures"
                value={formData.subject_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Exam Year (Optional)</label>
              <select name="exam_year" value={formData.exam_year} onChange={handleChange}>
                <option value="">Select exam year</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="button button-primary" style={{ marginTop: '20px' }}>
            <FaSave /> Save Changes
          </button>
          
          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`} style={{ marginTop: '20px' }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditPaperModal;