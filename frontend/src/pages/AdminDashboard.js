// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import ManagePapersTable from '../components/admin/ManagePapersTable';
import EditPaperModal from '../components/admin/EditPaperModal'; // <-- IMPORT MODAL
import { searchPapers, getFilters } from '../services/api'; // <-- IMPORT getFilters
import '../components/admin/EditPaperModal.css'; // <-- IMPORT MODAL CSS

function AdminDashboard() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allFilters, setAllFilters] = useState({ branches: [], subjects: [] }); // <-- State for filters

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null); // The paper to edit

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const papersRes = await searchPapers({});
      setPapers(papersRes.data);
    } catch (err) {
      console.error("Failed to load papers", err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFilters = async () => {
    try {
      const filterRes = await getFilters();
      setAllFilters(filterRes.data);
    } catch (err) {
      console.error("Failed to load filters", err);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchFilters(); // <-- Load filters for the modal
  }, []);

  // Called from table to open the modal
  const handleEditClick = (paper) => {
    setEditingPaper(paper);
    setIsModalOpen(true);
  };

  // Called from modal on successful update
  const handleUpdateSuccess = () => {
    fetchPapers(); // Re-fetch the paper list to show changes
  };

  const onPaperDeleted = (deletedPaperId) => {
    setPapers(papers.filter(p => p.paper_id !== deletedPaperId));
  };

  return (
    <div className="admin-dashboard-page">
      <div className="card">
        <div className="card-header">
          <h2><FaFileAlt /> Manage All Papers</h2>
          <p>View, update, or delete existing papers in the library</p>
        </div>
        <ManagePapersTable
          papers={papers}
          loading={loading}
          onDeleteSuccess={onPaperDeleted}
          onEditClick={handleEditClick} // <-- Pass down the click handler
        />
      </div>

      {/* --- ADD THE MODAL COMPONENT --- */}
      {isModalOpen && (
        <EditPaperModal
          paper={editingPaper}
          allFilters={allFilters}
          onClose={() => setIsModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      {/* --- END MODAL --- */}
    </div>
  );
}

export default AdminDashboard;