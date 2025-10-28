// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors()); // Allows React to talk to this server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === API ROUTES ===
// All student-facing routes will be prefixed with /api/student
app.use('/api/student', studentRoutes);

// All admin-facing routes will be prefixed with /api/admin
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});