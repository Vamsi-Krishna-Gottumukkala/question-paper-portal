// components/student/ResultsList.js
import React from 'react';

function ResultsList({ papers, loading }) {
    return (
        <div className="card results-list">
            <h3>Results:</h3>
            {loading && <p>Loading...</p>}
            {!loading && papers.length === 0 && <p>No papers found. Try adjusting your search.</p>}
            {!loading && papers.length > 0 && (
                <ul>
                    {papers.map(paper => (
                        <li key={paper.paper_id}>
                            <strong>{paper.subject_name} ({paper.exam_year || 'N/A'})</strong>
                            {/* file_url is the direct S3 link */}
                            <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ResultsList;