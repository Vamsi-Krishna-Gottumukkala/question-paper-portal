// pages/StudentSearch.js
import React, { useState, useEffect } from 'react';
import FilterForm from '../components/student/FilterForm';
import ResultsList from '../components/student/ResultsList';
import { getFilters, searchPapers } from '../services/api';

function StudentSearch() {
    const [papers, setPapers] = useState([]);
    const [filters, setFilters] = useState({ branches: [], subjects: [] });
    const [loading, setLoading] = useState(true);

    // Fetch filters on page load
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await getFilters();
                setFilters(res.data);
            } catch (err) {
                console.error("Failed to load filters", err);
            }
            setLoading(false);
        };
        fetchFilters();
    }, []);

    // This function is passed to FilterForm
    const handleSearch = async (searchParams) => {
        setLoading(true);
        try {
            const res = await searchPapers(searchParams);
            setPapers(res.data);
        } catch (err) {
            console.error("Search failed", err);
            setPapers([]); // Clear old results on error
        }
        setLoading(false);
    };

    if (loading && !filters.branches.length) {
        return <div className="card">Loading resources...</div>;
    }

    return (
        <div>
            <FilterForm filters={filters} onSearch={handleSearch} />
            <ResultsList papers={papers} loading={loading} />
        </div>
    );
}

export default StudentSearch;