const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  isValidDateDDMMYYYY,
  isAtLeast18YearsOld,
} = require("../utils/validation");
const { hashPassword, calculateAge } = require("../utils");
const validate = require("../middleware/validate");
const yup = require("yup");

router.get("/", async (req, res) => {
  try {
    const user = await User.getAll();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.getById(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const userSchema = yup.object().shape({
  firstname: yup.string().required().max(50),
  lastname: yup.string().required().max(50),
  middlename: yup.string().max(50),
  email: yup
    .string()
    .email()
    .required()
    .test("is-email-unique", "Email already exists", async (value) => {
      return await User.isEmailUnique(value);
    }),
  password: yup.string().required().min(6).max(50),
  dateofbirth: yup
    .string()
    .required()
    .test(
      "valid-format",
      "Date of birth must be in dd/mm/yyyy format",
      (value) => isValidDateDDMMYYYY(value)
    )
    .test("minimum-age", "You must be at least 18 years old", (value) =>
      isAtLeast18YearsOld(value)
    ),
});

router.post("/", validate(userSchema), async (req, res) => {
  try {
    console.log(req.body);
    const validData = await userSchema.validate(req.body);
    const cleanedData = {
      firstname: validData.firstname,
      lastname: validData.lastname,
      middlename: validData.middlename,
      email: validData.email,
      password: validData.password,
      dateofbirth: validData.dateofbirth,
    };
    cleanedData.password = await hashPassword(validData.password);
    cleanedData.age = calculateAge(validData.dateofbirth);
    console.log(cleanedData);
    const newUser = await User.create(cleanedData);
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Thêm các route khác (GET by ID, PUT, DELETE) tương tự

module.exports = router;
