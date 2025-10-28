// controllers/studentController.js
const db = require('../config/db');

const searchPapers = async (req, res) => {
    try {
        const { branch_id, year, semester, subject_id } = req.query;

        let query = `
            SELECT p.paper_id, p.exam_year, p.file_url, s.subject_name, b.branch_name
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
        if (subject_id) {
            query += " AND s.subject_id = ?";
            params.push(subject_id);
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
        const [subjects] = await db.query("SELECT * FROM subjects");
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