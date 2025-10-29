// frontend/src/pages/StudentSearch.js
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import FilterForm from '../components/student/FilterForm';
import ResultsList from '../components/student/ResultsList';
import { getFilters, searchPapers } from '../services/api';

function StudentSearch() {
  const [papers, setPapers] = useState([]);
  const [filters, setFilters] = useState({ branches: [], subjects: [] });
  const [loading, setLoading] = useState(true);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const res = await searchPapers(searchParams);
      setPapers(res.data);
    } catch (err) {
      console.error("Search failed", err);
      setPapers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch filters AND initial results
    const loadData = async () => {
      setLoading(true);
      try {
        const filterRes = await getFilters();
        setFilters(filterRes.data);
        
        const papersRes = await searchPapers({}); // Initial search
        setPapers(papersRes.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
      setLoading(false);
    };
    loadData();
  }, []); // Runs once on mount

  return (
    <div className="student-search-page">
      <div className="card">
        <div className="card-header">
          <h2><FaSearch /> Search for Papers</h2>
          <p>Filter by branch, year, semester, or subject name</p>
        </div>
        <FilterForm filters={filters} onSearch={handleSearch} />
      </div>

      <ResultsList papers={papers} loading={loading} />
    </div>
  );
}

export default StudentSearch;