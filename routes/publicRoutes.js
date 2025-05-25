// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const yup = require("yup");

// Public route
router.get("/check-email/:email", async (req, res) => {
  const { email } = req.params;

  const userSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
      .test("is-email-unique", "Email already exists", async (value) => {
        return await User.isEmailUnique(value);
      }),
  });

  try {
    await userSchema.validate({ email });
    res.status(201).json({
      success: true,
      message: "Email is available",
    });
  } catch (error) {
    res.status(422).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
