// frontend/src/components/student/FilterForm.js
import React, { useState } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';

function FilterForm({ filters, onSearch }) {
  const [searchParams, setSearchParams] = useState({
    branch_id: '',
    year: '',
    semester: '',
    subject_name: '',
  });

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      branch_id: '',
      year: '',
      semester: '',
      subject_name: '',
    });
    onSearch({}); // Reset search
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Branch</label>
          <select name="branch_id" value={searchParams.branch_id} onChange={handleSearchChange}>
            <option value="">All Branches</option>
            {filters.branches.map(b => (
              <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Year</label>
          <select name="year" value={searchParams.year} onChange={handleSearchChange}>
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="form-group">
          <label>Semester</label>
          <select name="semester" value={searchParams.semester} onChange={handleSearchChange}>
            <option value="">All Semesters</option>
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
            value={searchParams.subject_name}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
        <button type="submit" className="button button-primary" style={{ flex: 1 }}>
          <FaSearch /> Search
        </button>
        <button type="button" onClick={handleReset} className="button button-secondary">
          <FaRedo /> Reset
        </button>
      </div>
    </form>
  );
}

export default FilterForm;