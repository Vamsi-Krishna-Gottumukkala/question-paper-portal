// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const upload = require('../middleware/s3-upload');

// POST /api/admin/upload
router.post('/upload', upload.single('paperFile'), controller.uploadPaper);

// DELETE /api/admin/paper/:id
router.delete('/paper/:paperId', controller.deletePaper);

// --- ADD THESE NEW ROUTES ---
// POST /api/admin/branch
router.post('/branch', controller.addBranch);

// PUT /api/admin/branch/:id
router.put('/branch/:id', controller.updateBranch);

router.delete('/branch/:id', controller.deleteBranch);

router.put('/paper/:paperId', controller.updatePaper);
// --- END NEW ROUTE ---

module.exports = router;