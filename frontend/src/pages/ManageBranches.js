// frontend/src/pages/ManageBranches.js
import React, { useState, useEffect } from 'react';
import { FaSitemap, FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { getFilters, addBranch, updateBranch, deleteBranch } from '../services/api';

// Simple list style for the branches
const listStyles = {
  listStyle: 'none',
  padding: 0,
  marginTop: '20px',
};
const itemStyles = {
  background: 'var(--color-bg-primary)',
  padding: '15px 20px',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};
const editFormStyles = {
  display: 'flex',
  flex: 1,
  gap: '10px',
};

function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [newBranchName, setNewBranchName] = useState('');
  const [editingId, setEditingId] = useState(null); // Which branch_id we are editing
  const [editingName, setEditingName] = useState(''); // The text inside the edit input
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all branches on load
  const fetchBranches = async () => {
    try {
      const res = await getFilters();
      setBranches(res.data.branches);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load branches.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Handler for "Add Branch" form
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    try {
      const res = await addBranch(newBranchName.trim());
      setBranches([...branches, res.data.branch]); // Add new branch to our list
      setNewBranchName('');
      setMessage(res.data.message);
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to add branch.');
      setIsError(true);
    }
  };

  // Handler for clicking the "Edit" button
  const handleEditClick = (branch) => {
    setEditingId(branch.branch_id);
    setEditingName(branch.branch_name);
    setMessage('');
  };

  // Handler for clicking the "Save" button
  const handleSaveEdit = async (branchId) => {
    try {
      const res = await updateBranch(branchId, editingName.trim());
      // Update the name in our local list
      setBranches(branches.map(b => 
        b.branch_id === branchId ? { ...b, branch_name: editingName.trim() } : b
      ));
      setMessage(res.data.message);
      setIsError(false);
      setEditingId(null); // Stop editing
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to update branch.');
      setIsError(true);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch? This is permanent.")) {
      try {
        const res = await deleteBranch(branchId);
        // On success, filter it out of the local state
        setBranches(branches.filter(b => b.branch_id !== branchId));
        setMessage(res.data.message);
        setIsError(false);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || 'Failed to delete branch.');
        setIsError(true);
      }
    }
  };

  return (
    <div className="manage-branches-page">
      <div className="card">
        <div className="card-header">
          <h2><FaSitemap /> Manage Branches</h2>
          <p>Add or edit college branches</p>
        </div>

        {/* --- Add New Branch Form --- */}
        <form onSubmit={handleAddBranch} style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            placeholder="Enter new branch name"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            style={{ flex: 1 }}
            required
          />
          <button type="submit" className="button button-primary">
            <FaPlus /> Add Branch
          </button>
        </form>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`} style={{ marginTop: '20px' }}>
            {message}
          </div>
        )}
      </div>

      {/* --- Existing Branches List --- */}
      <div className="card">
        <div className="card-header">
          <h2>Existing Branches</h2>
        </div>
        {loading ? (
          <p>Loading branches...</p>
        ) : (
          <ul style={listStyles}>
            {branches.map((branch) => (
              <li key={branch.branch_id} style={itemStyles}>
                {editingId === branch.branch_id ? (
                  // --- EDITING VIEW (UNCHANGED) ---
                  <div style={editFormStyles}>
                    {/* ... input and save/cancel buttons ... */}
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)} /* <-- BUG FIX */
                      style={{ flex: 1 }}
                    />
                    <button 
                      onClick={() => handleSaveEdit(branch.branch_id)} 
                      className="button button-primary"
                    >
                      <FaSave /> Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="button button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // --- DEFAULT VIEW (MODIFIED) ---
                  <>
                    <span style={{ fontWeight: 500 }}>{branch.branch_name}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleEditClick(branch)} 
                        className="button button-secondary"
                      >
                        <FaEdit /> Edit
                      </button>
                      {/* --- ADD DELETE BUTTON --- */}
                      <button 
                        onClick={() => handleDeleteBranch(branch.branch_id)}
                        className="button button-danger"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageBranches;