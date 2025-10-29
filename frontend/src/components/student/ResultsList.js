// frontend/src/components/student/ResultsList.js
import React from 'react';
import { FaDownload } from 'react-icons/fa';

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
          <a
            href={paper.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
            style={{ padding: '10px 15px' }}
          >
            <FaDownload />
            <span style={{ marginLeft: '8px' }}>Download</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default ResultsList;