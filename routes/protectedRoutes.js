// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

router.get('/status', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Access granted",
  });
});

// Protected route accessible by any authenticated user
router.get('/guest', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// Admin-only route
router.get('/staff', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

module.exports = router;
