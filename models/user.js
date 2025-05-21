const db = require("../config/db");

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
