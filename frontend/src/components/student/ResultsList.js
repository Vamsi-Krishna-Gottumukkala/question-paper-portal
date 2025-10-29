// frontend/src/components/student/ResultsList.js
import React from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';

function ResultsList({ papers, loading }) {
  if (loading) {
    return <div className="no-results" style={{ background: 'transparent' }}>Loading papers...</div>;
  }
  
  if (papers.length === 0) {
    return <div className="no-results">No papers found. Try adjusting your filters.</div>;
  }

  return (
    <ul className="results-list">
      {papers.map(paper => (
        <li key={paper.paper_id} className="results-list-item">
          <div className="details">
            <h3>{paper.subject_name}</h3>
            <span>
              {paper.branch_name} | Year: {paper.year} | Sem: {paper.semester}
            </span>
          </div>
          
          {/* --- WRAP BUTTONS IN A DIV --- */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* --- NEW "VIEW" BUTTON --- */}
            <a
              href={paper.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary" // Use secondary style
              style={{ padding: '10px 15px' }}
            >
              <FaEye />
              <span style={{ marginLeft: '8px' }}>View</span>
            </a>

            {/* --- UPDATED "DOWNLOAD" BUTTON --- */}
            <a
              href={`${process.env.REACT_APP_API_URL}/api/student/download/${paper.paper_id}`} // <-- HITS THE NEW BACKEND ROUTE
              className="button button-primary"
              style={{ padding: '10px 15px' }}
            >
              <FaDownload />
              <span style={{ marginLeft: '8px' }}>Download</span>
            </a>
          </div>
          {/* --- END WRAPPER --- */}

        </li>
      ))}
    </ul>
  );
}

export default ResultsList;