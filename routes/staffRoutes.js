const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");

// Admin-only route
router.get(
  "/status/staff",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Access granted",
    });
  }
);

// Admin-only route
router.get("/staff", authenticateToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

module.exports = router;
