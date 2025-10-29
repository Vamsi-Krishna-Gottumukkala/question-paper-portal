// frontend/src/components/admin/UploadForm.js
import React, { useState, useCallback } from 'react';
import { FaUpload, FaFilePdf } from 'react-icons/fa';
import { uploadPaper } from '../../services/api';

function UploadForm({ filters }) {
  const [file, setFile] = useState(null);
  const [branchId, setBranchId] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [subjectName, setSubjectName] = useState(''); // Text input for subject
  const [examYear, setExamYear] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const clearForm = () => {
    setFile(null);
    setBranchId('');
    setSemester('');
    setYear('');
    setSubjectName('');
    setExamYear('');
  };

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file || !branchId || !semester || !year || !subjectName.trim()) {
      setMessage('Please fill all required fields and select a file.');
      setIsError(true);
      return;
    }

    // The backend will now handle finding or creating the subject
    const formData = new FormData();
    formData.append('paperFile', file);
    formData.append('branch_id', branchId);
    formData.append('semester', semester);
    formData.append('year', year);
    formData.append('subject_name', subjectName.trim());
    formData.append('exam_year', examYear);

    setMessage('Uploading...');
    setIsError(false);
    try {
      await uploadPaper(formData);
      setMessage('Upload Successful! The paper is now in the library.');
      setIsError(false);
      clearForm(); // Clear the form on success
    } catch (err) {
      console.error(err);
      setMessage('Upload Failed. Server error or invalid data.');
      setIsError(true);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Branch</label>
          <select value={branchId} onChange={e => setBranchId(e.target.value)} required>
            <option value="">Select branch</option>
            {filters.branches.map(b => (
              <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Year</label>
          <select value={year} onChange={e => setYear(e.target.value)} required>
            <option value="">Select year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="form-group">
          <label>Semester</label>
          <select value={semester} onChange={e => setSemester(e.target.value)} required>
            <option value="">Select semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="form-group">
          <label>Subject Name</label>
          <input
            type="text"
            placeholder="e.g., Data Structures"
            value={subjectName}
            onChange={e => setSubjectName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Exam Year (Optional)</label>
          <select value={examYear} onChange={e => setExamYear(e.target.value)}>
            <option value="">Select exam year</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`drag-drop-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <FaFilePdf className="icon" />
        <p><strong>Click to browse</strong> or drag and drop your PDF here</p>
        {file && <span className="file-name">{file.name}</span>}
        <input id="file-input" type="file" onChange={(e) => handleFileChange(e.target.files[0])} accept=".pdf" />
      </div>

      <button type="submit" className="button button-primary button-fullwidth" style={{ marginTop: '20px' }}>
        <FaUpload /> Upload Paper
      </button>

      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </form>
  );
}

export default UploadForm;