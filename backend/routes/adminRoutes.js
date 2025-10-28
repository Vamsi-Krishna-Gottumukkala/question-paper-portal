// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const upload = require('../middleware/s3-upload'); // Import your S3 middleware

// POST /api/admin/upload
// 'upload.single("paperFile")' handles the file upload to S3
router.post('/upload', upload.single('paperFile'), controller.uploadPaper);

// You can add more admin routes here later, e.g., to delete a paper
// DELETE /api/admin/paper/:id
// router.delete('/paper/:id', controller.deletePaper);

module.exports = router;