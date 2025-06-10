// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");
const User = require("../models/user");
const Email = require("../models/email");
const Number = require("../models/number");
const Contact = require("../models/contact");
const Identification = require("../models/identification");
const Occupation = require("../models/occupation");

router.get("/status", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Access granted",
  });
});

router.get("/profile", authenticateToken, async (req, res) => {
  console.log(req.user);
  const { id } = req.user;

  try {
    const [user, emails, numbers, contacts, identifications, occupations] =
      await Promise.all([
        User.getById(id),
        Email.getByUserId(id),
        Number.getByUserId(id),
        Contact.getByUserId(id),
        Identification.getByUserId(id),
        Occupation.getByUserId(id),
      ]);
    console.log(user, emails, numbers, contacts, identifications, occupations);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        email: user.email,
        dateofbirth: user.dateofbirth,
        age: user.age,
        isofficer: user.isofficer,
        emails: emails || [],
        numbers: numbers || [],
        contacts: contacts || [],
        identifications: identifications || [],
        occupations: occupations || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/profile", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { id, isofficer } = req.user;
  const { identifications, occupations, phones, emails, user, contacts } =
    req.body;
  if (isofficer) {
    return res.status(401).json({
      success: false,
      message: "Officers can't edit themselves.",
    });
  }

  const promiseData = [];

  if (contacts) {
    Contact.deleteByUserId(id);
    const contactsWithUserId = contacts.map(contact => ({
      ...contact,
      userid: id,
    }));
    promiseData.push(Contact.batchInsert(contactsWithUserId));
  }

  if (promiseData) {
    try {
      const data = await Promise.all(promiseData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Protected route accessible by any authenticated user
router.get("/guest", authenticateToken, authorizeRole("user"), (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

module.exports = router;
