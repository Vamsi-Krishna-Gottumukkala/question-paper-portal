// controllers/studentController.js
const db = require('../config/db');

const searchPapers = async (req, res) => {
    try {
        // Now expecting subject_name as a string for search
        const { branch_id, year, semester, subject_name } = req.query;

        let query = `
            SELECT p.paper_id, p.exam_year, p.file_url, p.uploaded_at,
                   s.subject_name, s.year, s.semester, b.branch_name
            FROM question_papers p
            JOIN subjects s ON p.subject_id = s.subject_id
            JOIN branches b ON s.branch_id = b.branch_id
            WHERE 1=1
        `;
        const params = [];

        if (branch_id) {
            query += " AND s.branch_id = ?";
            params.push(branch_id);
        }
        if (year) {
            query += " AND s.year = ?";
            params.push(year);
        }
        if (semester) {
            query += " AND s.semester = ?";
            params.push(semester);
        }
        // Use LIKE for subject_name for partial matches
        if (subject_name) {
            query += " AND s.subject_name LIKE ?";
            params.push(`%${subject_name}%`); // Case-insensitive, partial match
        }

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const getFilters = async (req, res) => {
    try {
        const [branches] = await db.query("SELECT * FROM branches");
        // For subjects, we need to ensure branch_id, year, semester are available for the admin dropdown
        const [subjects] = await db.query("SELECT s.subject_id, s.subject_name, s.branch_id, s.year, s.semester FROM subjects s");
        res.json({ branches, subjects });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    searchPapers,
    getFilters
};