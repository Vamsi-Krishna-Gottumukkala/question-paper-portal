// controllers/studentController.js
const db = require('../config/db');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config()


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

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

const downloadPaper = async (req, res) => {
    try {
        const { paperId } = req.params;
        
        // 1. Get the file key and subject name from the database
        const [rows] = await db.query(
            "SELECT p.file_key, s.subject_name FROM question_papers p " +
            "JOIN subjects s ON p.subject_id = s.subject_id " +
            "WHERE p.paper_id = ?",
            [paperId]
        );

        if (rows.length === 0) {
            return res.status(404).send('File not found.');
        }
        
        const fileInfo = rows[0];

        // 2. Set up S3 GetObject command
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileInfo.file_key,
        });
        
        // 3. Get the file from S3
        const s3Response = await s3.send(command);

        // 4. Sanitize the filename for download
        const filename = `${fileInfo.subject_name.replace(/[^a-z0-9]/gi, '_')}_paper.pdf`;
        
        // 5. Set headers to force download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', s3Response.ContentType || 'application/pdf');

        // 6. Stream the file from S3 to the user
        s3Response.Body.pipe(res);

    } catch (err) {
        console.error("Download error:", err);
        res.status(500).send('Error downloading file.');
    }
};

module.exports = {
    searchPapers,
    getFilters,
    downloadPaper
};