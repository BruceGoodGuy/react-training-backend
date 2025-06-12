const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");
const Kyc = require("../models/kyc");

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

// Get KYCs route - admin only
router.get(
  "/kycs",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      // Get query parameters
      const { result } = req.query;

      // Convert string to boolean if needed
      const filterByResult = result === "true";

      // Use the parameter in your Kyc retrieval
      // Assuming getAllWithUserInfo can accept a filter parameter
      // (modify the call based on how you want to use this parameter)
      if (filterByResult) {
        const kycs = await Kyc.getAllWithUserInfoNotPendingStatus();
        return res.status(200).json({
          success: true,
          message: "KYC data retrieved successfully",
          data: kycs,
        });
      }

      const kycs = await Kyc.getAllWithUserInfo(1);

      return res.status(200).json({
        success: true,
        message: "KYC data retrieved successfully",
        data: kycs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving KYC data",
        error: error.message,
      });
    }
  }
);

// Approve KYC route - admin only
router.post(
  "/kycs/:id/approve",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Update KYC status to 2 (approved)
      const result = await Kyc.updateStatus(id, status ? 0 : 2);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "KYC not found or could not be updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: `KYC ${status ? "approved" : "reject"} successfully`,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error approving KYC",
        error: error.message,
      });
    }
  }
);

// Admin-only route
router.get("/staff", authenticateToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

module.exports = router;
