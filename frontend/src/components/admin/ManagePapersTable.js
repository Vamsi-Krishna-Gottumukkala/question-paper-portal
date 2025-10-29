// frontend/src/components/admin/ManagePapersTable.js
import React, { useState } from 'react';
import { FaTrash, FaDownload, FaEdit } from 'react-icons/fa';
import { deletePaper } from '../../services/api'; // We need to create this in api.js

function ManagePapersTable({ papers, loading, onDeleteSuccess, onEditClick }) {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleDelete = async (paperId, fileKey) => {
    if (window.confirm("Are you sure you want to delete this paper? This action is permanent.")) {
      try {
        const res = await deletePaper(paperId, fileKey);
        setMessage(res.data.message);
        setIsError(false);
        onDeleteSuccess(paperId); // Tell the parent to refresh the list
      } catch (err) {
        console.error("Delete failed", err);
        setMessage(err.response?.data?.message || "Failed to delete paper.");
        setIsError(true);
      }
    }
  };

  if (loading) {
    return <div className="no-results" style={{ background: 'transparent' }}>Loading papers...</div>;
  }
  
  if (papers.length === 0) {
    return <div className="no-results">No papers uploaded yet.</div>;
  }

  return (
    <div className="table-container">
      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`} style={{ margin: '0 0 20px 0' }}>
          {message}
        </div>
      )}
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Branch</th>
            <th>Year/Sem</th>
            <th>Exam Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => (
            <tr key={paper.paper_id}>
              <td>{paper.subject_name}</td>
              <td>{paper.branch_name}</td>
              <td>Year: {paper.year}, Sem: {paper.semester}</td>
              <td>{paper.exam_year || 'N/A'}</td>
              <td style={{ display: 'flex', gap: '10px' }}>
                <a 
                  href={paper.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button button-secondary"
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  <FaDownload />
                </a>
                
                {/* --- ADD EDIT BUTTON --- */}
                <button
                  onClick={() => onEditClick(paper)} // <-- Call the handler
                  className="button button-primary"
                  style={{ padding: '8px 12px', fontSize: '14px', background: 'var(--color-accent-blue)' }}
                >
                  <FaEdit />
                </button>
                {/* --- END EDIT BUTTON --- */}

                <button 
                  onClick={() => handleDelete(paper.paper_id, paper.file_key)} 
                  className="button button-danger"
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePapersTable;