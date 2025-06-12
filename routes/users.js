const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  isValidDateYYYYMMDD,
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
  firstName: yup.string().required().max(50),
  lastName: yup.string().required().max(50),
  middleName: yup.string().max(50),
  email: yup
    .string()
    .email()
    .required()
    .test("is-email-unique", "Email already exists", async (value) => {
      return await User.isEmailUnique(value);
    }),
  password: yup.string().required().min(6).max(50),
  dateOfBirth: yup
    .string()
    .required()
    .test(
      "valid-format",
      "Date of birth must be in yyyy-mm-dd format",
      (value) => isValidDateYYYYMMDD(value)
    )
    .test("minimum-age", "You must be at least 18 years old", (value) =>
      isAtLeast18YearsOld(value)
    ),
  gender: yup
    .string()
    .required()
    .oneOf([
      "male",
      "female",
      "transgender_male",
      "transgender_female",
      "non_binary",
      "genderqueer",
      "genderfluid",
      "agender",
      "bigender",
      "demiboy",
      "demigirl",
      "two_spirit",
      "pangender",
      "androgyne",
      "intersex",
      "third_gender",
      "neutrois",
      "questioning",
      "other",
    ]),
});

router.post("/", validate(userSchema), async (req, res) => {
  try {
    const validData = await userSchema.validate(req.body);
    const cleanedData = {
      firstname: validData.firstName,
      lastname: validData.lastName,
      middlename: validData.middleName,
      email: validData.email,
      password: validData.password,
      dateofbirth: validData.dateOfBirth,
      gender: validData.gender,
    };
    cleanedData.password = await hashPassword(validData.password);
    cleanedData.age = calculateAge(validData.dateOfBirth);
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

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .test(
    "credentials-check",
    "Invalid email or password",
    async function (value) {
      const { email, password } = value;
      const user = await User.getByEmail(email, true);
      if (!user)
        return this.createError({
          path: "email",
          message: "Invalid email or password",
        });

      const isValidPassword = await User.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword)
        return this.createError({
          path: "email",
          message: "Invalid email or password",
        });

      this.options.context.user = user;

      return true;
    }
  );

router.post(
  "/authenticate",
  validate(loginSchema, (req) => ({})),
  (req, res) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      delete user.password;

      res
        .cookie("token", User.generateAuthToken(user), {
          httpOnly: true,
          secure: process.env.ENVIRONMENT === "production", // Ensure this is true in production (HTTPS)
          sameSite: process.env.ENVIRONMENT === "production" ? "None" : false, // Required for cross-site requests
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          success: true,
          message: "Login successful",
          data: user,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Thêm các route khác (GET by ID, PUT, DELETE) tương tự

module.exports = router;
