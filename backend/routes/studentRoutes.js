// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

// GET /api/student/papers
router.get('/papers', controller.searchPapers);

// GET /api/student/filters
router.get('/filters', controller.getFilters);

// --- ADD THIS NEW ROUTE ---
// GET /api/student/download/:paperId
router.get('/download/:paperId', controller.downloadPaper);
// --- END NEW ROUTE ---

module.exports = router;