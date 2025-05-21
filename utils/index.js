// utils/passwordUtils.js
const bcrypt = require("bcrypt");
const saltRounds = 12; // Higher is more secure but slower

async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (error) {
    throw new Error("Password hashing failed");
  }
}

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
}

function calculateAge(dobString) {
  // Parse the date string (expected format: dd/mm/yyyy)
  const [day, month, year] = dobString.split("/").map(Number);

  // Create a Date object
  const dob = new Date(year, month - 1, day); // month is 0-based in JS

  // Get today's date
  const today = new Date();

  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();

  // Adjust if birthday hasn't occurred yet this year
  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}
module.exports = { hashPassword, comparePasswords, calculateAge };
