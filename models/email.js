const db = require("../config/db");

const Email = {
  createTable: async () => {
    await db.schema.hasTable("emails").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("emails", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.string("email").notNullable();
          table.enu('type', [0, 1]).notNullable(); // 0 for Work, 1 for Personal.
          table.boolean("preferred").notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created emails table");
      }
    });
  },

  getAll: () => db("emails").select("*"),

  getById: (id) => db("emails").where({ id }).first(),

  create: (email) => db("emails").insert(email).returning("*"),

  update: (id, updates) => db("emails").where({ id }).update(updates),

  delete: (id) => db("emails").where({ id }).del(),
};

module.exports = Email;
