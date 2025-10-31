const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', authRoutes);

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Serve dashboard (protected route - will be handled by frontend)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

// Serve profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'profile.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Influora Backend Server Running!`);
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`\n💡 Press Ctrl+C to stop\n`);
});
