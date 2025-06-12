const User = require("../models/user");
const { hashPassword } = require("../utils");
async function runSeeder() {
  try {
    await User.create({
      firstname: "Khoa",
      lastname: "Nguyen",
      middlename: "Dang",
      email: "admin@admin.com",
      password: await hashPassword(process.env.DEFAULT_PASSWORD || "12345678"),
      gender: "male",
      dateofbirth: "1990-01-01",
      age: 33,
      description: "This is a test user",
      isofficer: true,
      created_at: new Date(),
    });
    console.log("All seeders completed");
  } catch (error) {
    console.error("Seeder error:", error);
  }
}

runSeeder();
