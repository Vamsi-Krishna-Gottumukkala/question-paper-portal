// components/student/FilterForm.js
import React, { useState } from 'react';

function FilterForm({ filters, onSearch }) {
    const [searchParams, setSearchParams] = useState({
        branch_id: '',
        year: '',
        semester: '',
        subject_id: ''
    });

    const handleSearchChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    // You could make the subject dropdown dynamic
    // For now, we show all subjects
    const filteredSubjects = filters.subjects.filter(s => {
        if (searchParams.branch_id && s.branch_id !== parseInt(searchParams.branch_id)) return false;
        if (searchParams.year && s.year !== parseInt(searchParams.year)) return false;
        if (searchParams.semester && s.semester !== parseInt(searchParams.semester)) return false;
        return true;
    });

    const onSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    return (
        <div className="card">
            <h2>Student Search</h2>
            <form onSubmit={onSubmit}>
                <label>Branch:</label>
                <select name="branch_id" value={searchParams.branch_id} onChange={handleSearchChange}>
                    <option value="">Select Branch</option>
                    {filters.branches.map(b => (
                        <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                    ))}
                </select>

                <label>Year:</label>
                <select name="year" value={searchParams.year} onChange={handleSearchChange}>
                    <option value="">Select Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>

                <label>Semester:</label>
                <select name="semester" value={searchParams.semester} onChange={handleSearchChange}>
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>

                <label>Subject:</label>
                <select name="subject_id" value={searchParams.subject_id} onChange={handleSearchChange}>
                    <option value="">Select Subject (Optional)</option>
                    {filteredSubjects.map(s => (
                        <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                    ))}
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default FilterForm;