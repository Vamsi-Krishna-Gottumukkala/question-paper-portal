// controllers/adminController.js
const db = require('../config/db');

const uploadPaper = async (req, res) => {
    try {
        // req.file is added by the multer-s3 middleware
        const { subject_id, exam_year } = req.body;
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        const file_url = req.file.location; // The public URL from S3
        const file_key = req.file.key;       // The S3 key (for deleting)

        if (!subject_id || !file_url) {
            return res.status(400).send('Missing subject_id or file_url.');
        }

        const query = "INSERT INTO question_papers (subject_id, exam_year, file_url, file_key) VALUES (?, ?, ?, ?)";
        await db.query(query, [subject_id, exam_year, file_url, file_key]);

        res.status(201).send({ message: 'File uploaded successfully!', url: file_url });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Add other admin functions here, like deletePaper
// const deletePaper = async (req, res) => { ... }

module.exports = {
    uploadPaper
};