// components/admin/UploadForm.js
import React, { useState } from 'react';
import { uploadPaper } from '../../services/api';

function UploadForm({ filters }) {
    const [file, setFile] = useState(null);
    const [subjectId, setSubjectId] = useState('');
    const [examYear, setExamYear] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file || !subjectId) {
            setMessage('Please select a subject and a file.');
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('paperFile', file);
        formData.append('subject_id', subjectId);
        formData.append('exam_year', examYear);

        setMessage('Uploading...');
        setIsError(false);
        try {
            const res = await uploadPaper(formData);
            setMessage(`Upload Successful!`);
            setIsError(false);
            // Clear form
            setFile(null);
            setSubjectId('');
            setExamYear('');
            e.target.reset(); // Resets the file input
        } catch (err) {
            console.error(err);
            setMessage('Upload Failed. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="card">
            <h2>Librarian Upload</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Subject:</label>
                    <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
                        <option value="">Select Subject</option>
                        {filters.subjects.map(s => (
                            <option key={s.subject_id} value={s.subject_id}>
                                {s.subject_name} (Year: {s.year}, Sem: {s.semester})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Exam Year (Optional):</label>
                    <input
                        type="number"
                        placeholder="e.g., 2024"
                        value={examYear}
                        onChange={e => setExamYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>File (PDF, DOCX, etc.):</label>
                    <input type="file" onChange={onFileChange} required />
                </div>
                <button type="submit">Upload</button>
            </form>
            {message && (
                <p className={`message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default UploadForm;