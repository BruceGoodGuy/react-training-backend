const db = require("../config/db");
const { comparePasswords } = require("../utils");
const jwt = require("jsonwebtoken");

const User = {
  createTable: async () => {
    await db.schema.hasTable("users").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("users", (table) => {
          table.increments("id").primary();
          table.string("firstname").notNullable();
          table.string("lastname").notNullable();
          table.string("middlename").nullable();
          table.string("email").notNullable().unique();
          table.string("password").notNullable();
          table.date("dateofbirth").notNullable();
          table.integer("age").notNullable();
          table.text("description").nullable();
          table.boolean("isofficer").defaultTo(false);
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created users table");
      }
    });
  },

  getAll: () =>
    db("users").select([
      "id",
      "firstname",
      "lastname",
      "middlename",
      "email",
      "dateofbirth",
      "age",
      "isofficer",
    ]),

  getById: (id) =>
    db("users")
      .where({ id })
      .first()
      .select([
        "id",
        "firstname",
        "lastname",
        "middlename",
        "email",
        "dateofbirth",
        "age",
        "isofficer",
      ]),

  create: (user) =>
    db("users")
      .insert(user)
      .returning([
        "firstname",
        "lastname",
        "middlename",
        "email",
        "dateofbirth",
        "age",
        "isofficer",
      ]),

  getByEmail: (email) =>
    db("users")
      .where({ email })
      .first()
      .select([
        "id",
        "firstname",
        "lastname",
        "middlename",
        "email",
        "dateofbirth",
        "age",
        "isofficer",
      ]),

  verifyPassword: async (plainPassword, password) => {
    console.log("Verifying password", plainPassword);
    console.log("Hashed password", password);
    return comparePasswords(plainPassword, password);
  },

  generateAuthToken: (user) => {
    const secretKey = process.env.SECRET_KEY;
    const payload = {
      id: user.id,
      email: user.email,
      isofficer: user.isofficer,
    };
    const options = { expiresIn: process.env.TOKEN_EXPIRATION || "1h" };
    return jwt.sign(payload, secretKey, options);
  },

  update: (id, updates) => db("users").where({ id }).update(updates),

  delete: (id) => db("users").where({ id }).del(),

  isEmailUnique: async (email, excludeId = null) => {
    const query = db("users").where({ email });
    if (excludeId) {
      query.andWhereNot({ id: excludeId });
    }
    const user = await query.first();
    return !user;
  },
};

module.exports = User;
