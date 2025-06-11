// routes/protectedRoutes.js
const express = require("express");
const knex = require("../config/db");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");
const User = require("../models/user");
const Email = require("../models/email");
const Number = require("../models/number");
const Contact = require("../models/contact");
const Identification = require("../models/identification");
const Occupation = require("../models/occupation");
const Asset = require("../models/asset");
const Income = require("../models/income");
const Investment = require("../models/investment");
const Kyc = require("../models/kyc");
const Liability = require("../models/liability");
const SourceOfWealth = require("../models/sourceofwealth");

async function getUserProfileData(userId) {
  try {
    const [user, emails, numbers, contacts, identifications, occupations] =
      await Promise.all([
        User.getById(userId),
        Email.getByUserId(userId),
        Number.getByUserId(userId),
        Contact.getByUserId(userId),
        Identification.getByUserId(userId),
        Occupation.getByUserId(userId),
      ]);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        email: user.email,
        dateofbirth: user.dateofbirth,
        age: user.age,
        isofficer: user.isofficer,
      },
      emails: emails || [],
      numbers: numbers || [],
      contacts: contacts || [],
      identifications: identifications || [],
      occupations: occupations || [],
    };
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    throw error;
  }
}

async function getKycData(userId) {
  try {
    const kyc = await Kyc.getByUserId(userId);
    let promiseData = [User.getById(userId)];
    console.log("KYC Data:", kyc);
    if (kyc.length > 0) {
      promiseData = [
        ...promiseData,
        Asset.getByKycId(kyc.id),
        Income.getByKycId(kyc.id),
        Investment.getByKycId(kyc.id),
        Liability.getByKycId(kyc.id),
        SourceOfWealth.getByKycId(kyc.id),
      ];
    }
    const [user, assets, incomes, investments, liabilities, sourceofwealth] =
      await Promise.all(promiseData);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        email: user.email,
        dateofbirth: user.dateofbirth,
        age: user.age,
        isofficer: user.isofficer,
      },
      assets: assets || [],
      incomes: incomes || [],
      investments: investments || {},
      kycs: kyc || [],
      liabilities: liabilities || [],
      sourcesOfWealth: sourceofwealth || [],
    };
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    throw error;
  }
}

router.get("/status", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Access granted",
  });
});

router.get("/profile", authenticateToken, async (req, res) => {
  const { id } = req.user;

  try {
    const profileData = await getUserProfileData(id);

    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/kyc", authenticateToken, async (req, res) => {
  const { id } = req.user;

  try {
    const kycData = await getKycData(id);

    res.status(200).json({
      success: true,
      data: kycData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get(
  "/profile/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const profileData = await getUserProfileData(id);

      res.status(200).json({
        success: true,
        data: profileData,
      });
    } catch (error) {
      console.error("Error fetching user profile by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

router.post("/profile", authenticateToken, async (req, res) => {
  const { id, isofficer } = req.user;
  const { identifications, occupations, phones, emails, user, contacts } =
    req.body;
  if (isofficer) {
    return res.status(401).json({
      success: false,
      message: "Officers can't edit themselves.",
    });
  }

  try {
    await knex.transaction(async (trx) => {
      // Update contact.
      await Contact.deleteByUserId(id).transacting(trx);
      if (contacts && contacts.length > 0) {
        const contactsWithUserId = contacts.map((contact) => ({
          ...contact,
          userid: id,
        }));
        await Contact.batchInsert(contactsWithUserId).transacting(trx);
      }

      // Update email.
      await Email.deleteByUserId(id).transacting(trx);
      if (emails && emails.length > 0) {
        const emailsWithUserId = emails.map((email) => ({
          ...email,
          userid: id,
        }));
        await Email.batchInsert(emailsWithUserId).transacting(trx);
      }

      // Update phone.
      await Number.deleteByUserId(id).transacting(trx);
      if (phones && phones.length > 0) {
        const phonesWithUserId = phones.map((phone) => ({
          ...phone,
          userid: id,
        }));
        await Number.batchInsert(phonesWithUserId).transacting(trx);
      }

      // Update occupations.
      await Occupation.deleteByUserId(id).transacting(trx);
      if (occupations && occupations.length > 0) {
        const occupationsWithUserId = occupations.map((occupation) => ({
          ...occupation,
          userid: id,
        }));
        await Occupation.batchInsert(occupationsWithUserId).transacting(trx);
      }

      // Update identifications.
      await Identification.deleteByUserId(id).transacting(trx);
      if (identifications && identifications.length > 0) {
        const identificationsWithUserId = identifications.map((occupation) => ({
          ...occupation,
          userid: id,
        }));
        await Identification.batchInsert(identificationsWithUserId).transacting(
          trx
        );
      }

      if (user && Object.keys(user).length > 0) {
        // Update user profile.
        const updatedUser = await User.updateById(id, user).transacting(trx);
      }

      // Add more tables here similarly.
    });
    return res.status(201).json({
      success: true,
      message: "Updated user profile successfully",
    });
  } catch (error) {
    console.error(`Transaction failed:`, error);
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get(
  "/list",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const users = await User.getAllButMe(req.user.id);
      return res.status(200).json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Protected route accessible by any authenticated user
router.get("/guest", authenticateToken, authorizeRole("user"), (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

module.exports = router;
