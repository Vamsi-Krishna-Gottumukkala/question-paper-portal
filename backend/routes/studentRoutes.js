// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

// GET /api/student/papers
// (e.g., /api/student/papers?branch_id=1&year=2)
router.get('/papers', controller.searchPapers);

// GET /api/student/filters
// Gets all branches, subjects, etc. for dropdowns
router.get('/filters', controller.getFilters);

module.exports = router;